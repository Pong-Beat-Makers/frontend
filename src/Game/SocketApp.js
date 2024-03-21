import {
    closeMatchingModal,
    openPlayGameModal,
    openBoardModal,
    openErrorModal,
    setupConnectPeopleAtMatchingModal,
    changeGiveUpToEnd, renderEndStatus, setupActiveReadyBtn, setInfoMessageAtModal
} from "./gameUtils.js";
import GameApp from "./gameApp.js";
import { GAME_TYPE } from "./gameTemplate.js";
import { getCookie } from '../Public/cookieUtils.js';
import {player} from "../app.js";
import { GAME_SERVER_DOMAIN, GAME_WEBSOCKET } from '../Public/global.js';

export const SOCKET_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
}

class SocketApp {
    constructor() {
        this._waitSocket = undefined;
        this._gameSocket = undefined;

        this._matchingContainer = undefined;
        this._boardContainer = undefined;
        this._gameContiner = undefined;

        this._gameCanvas = undefined;
    }

    readyToPlay() {
        const data = {
            'token': player._token
        }
        if (this.isGameState() === SOCKET_STATE.OPEN) {
            this._gameSend(data);
        }
    }

     matching(gameType) {
        let gameTypeUrl;

        if (gameType === GAME_TYPE.RANDOM) {
            gameTypeUrl = "random";
        } else if (gameType === GAME_TYPE.TOURNAMENT) {
            gameTypeUrl = "tournament";
        }

        const waitSocket = new WebSocket(`${GAME_WEBSOCKET}/ws/game/waitingroom/${gameTypeUrl}/`);

        waitSocket.addEventListener('message', e => {
            const data = JSON.parse(e.data);

            if (data.room_id !== undefined) {
                openBoardModal(this, gameType, data.user_nicknames);
                if (gameType !== GAME_TYPE.TWO_PLAYER) {
                    this._boardContainer.querySelector('.modal__ready-btn').remove();
                }
                if (data.player === 2) {
                    data.user_nicknames = data.user_nicknames.reverse();
                }
                this._enterGameRoom(data.room_id, gameType, data.user_nicknames);
            } else if (data.type === "send_waiting_number") {
                setupConnectPeopleAtMatchingModal(this._matchingContainer, data.waiting_number);
            }
        });

        waitSocket.onopen = () => {
            const data = {
                'token': player._token
            }

            this._waitSend(data);
        }

        waitSocket.onerror = () => {
            openErrorModal('There was a problem with the game server.');
        }

        waitSocket.onclose = () => {
            closeMatchingModal(this._matchingContainer, this);
        }

        this._waitSocket = waitSocket;
    }

    localPlay() {
        const userNickname = [player.getNickName(), 'GUEST'];

        openBoardModal(this, GAME_TYPE.TWO_PLAYER, userNickname);
        this._enterGameRoom(`local/${crypto.randomUUID()}`, GAME_TYPE.TWO_PLAYER, userNickname);
    }

    _enterGameRoom(room_id, gameType, playerNames) {
        const gameSocket = new WebSocket(`${GAME_WEBSOCKET}/ws/game/${room_id}/`);
        console.log(`enter the room id: ${room_id}`);

        gameSocket.addEventListener('message', e => {
            const data = JSON.parse(e.data);

            if (data.type === 'send_system_message') {
                if (data.message === 'Game Ready') {
                    if (5 < data.counter) {
                        setInfoMessageAtModal(this._boardContainer, data.counter - 5);
                    } else if (data.counter === 5) {
                        openPlayGameModal(this, gameType, playerNames);
                        this._gameApp = new GameApp(this._gameCanvas, gameType);
                        this._gameApp.setPlayer(data.player);

                        this._boardContainer.remove();
                        this._boardContainer = undefined;

                        this._gameApp.renderConter(data.counter);
                    } else if (data.counter < 5) {
                        this._gameApp.renderConter(data.counter);
                    }
                } else if (data.message === 'Game Start') {
                    if (gameType === GAME_TYPE.TWO_PLAYER) {
                        openPlayGameModal(this, gameType, [player.getNickName(), 'GUEST']);
                        changeGiveUpToEnd(this._gameContiner);
                        this._gameApp = new GameApp(this._gameCanvas, gameType);
                        this._gameApp.setPlayer(2);

                        this._boardContainer.remove();
                        this._boardContainer = undefined;

                        this._gameContiner.addEventListener('keydown', e => {
                            if (e.key === 'ArrowDown') this._gameSend({'player': 2, 'move': 'up'});
                            else if (e.key === 'ArrowUp') this._gameSend({'player': 2, 'move': 'down'});
                            else if (e.keyCode === 83) this._gameSend({'player': 1, 'move': 'up'});
                            else if (e.keyCode === 87) this._gameSend({'player': 1, 'move': 'down'});
                        });

                        this._gameContiner.addEventListener('keyup', e => {
                            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') this._gameSend({'player': 2, 'move': 'stop'});
                            else if (e.keyCode === 83 || e.keyCode === 87) this._gameSend({'player': 1, 'move': 'stop'});
                        });
                    } else {
                        this._gameApp.renderConter(data.counter);

                        this._gameContiner.addEventListener('keydown', e => {
                            if (e.key === 'ArrowLeft') this._gameSend({'move': 'up'});
                            else if (e.key === 'ArrowRight') this._gameSend({'move': 'down'});
                            else if (e.keyCode === 67) this._gameApp.toggleCamera();
                        });

                        this._gameContiner.addEventListener('keyup', e => {
                            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') this._gameSend({'move': 'stop'});
                        });
                    }
                } else if (data.message === 'Game End') {
                    renderEndStatus(this._gameCanvas, this._gameApp.getPlayer(), data.score, gameType);
                    changeGiveUpToEnd(this._gameContiner);
                }
            } else if (data.type === 'send_game_status') {
                this._gameApp.dataRander(data);
            }
        });

       gameSocket.onopen = () => {
           if (gameType === GAME_TYPE.TWO_PLAYER) {
               setupActiveReadyBtn(this._boardContainer);
           } else {
               this.readyToPlay();
           }
       }

       gameSocket.onerror = () => {
           this._boardContainer.remove();
           this.gameClose();
           openErrorModal('There was a problem with the game server.');
       }

        this._gameSocket = gameSocket;
    }

    _waitSend(data) {
        this._waitSocket.send(JSON.stringify(data));
    }

    isWaitState() {
        if (this._waitSocket !== undefined)
            return this._waitSocket.readyState;
        return SOCKET_STATE.CLOSED;
    }

    waitClose() {
        if (this.isWaitState() === SOCKET_STATE.OPEN || this.isWaitState() === SOCKET_STATE.CONNECTING) {
            this._waitSocket.close();
        }
    }

    _gameSend(data) {
        if (this.isGameState() === SOCKET_STATE.OPEN) {
            this._gameSocket.send(JSON.stringify(data));
        }
    }

    isGameState() {
        if (this._gameSocket !== undefined)
            return this._gameSocket.readyState;
        return SOCKET_STATE.CLOSED;
    }

    gameClose() {
        if (this.isGameState() === SOCKET_STATE.OPEN || this.isGameState() === SOCKET_STATE.CONNECTING) {
            this._gameSocket.close();
        }
    }

    setGameContainer(gameContainer) {
        this._gameContiner = gameContainer;
    }

    setMatchingContainer(matchingContainer) {
        this._matchingContainer = matchingContainer;
    }

    setBoardContainer(boardContainer) {
        this._boardContainer = boardContainer;
    }

    setGameCanvas(gameCanvas) {
        this._gameCanvas = gameCanvas;
    }
}

export default new SocketApp();
