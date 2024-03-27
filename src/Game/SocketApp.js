import {
    closeMatchingModal,
    openPlayGameModal,
    openBoardModal,
    openInfoModal,
    setupConnectPeopleAtMatchingModal,
    changeGiveUpToEnd,
    renderEndStatus,
    setupActiveReadyBtn,
    setInfoMessageAtModal,
    getInfoPlayerList,
    generateGuest,
    orderPlayers, setCommentInfoModal, removeExitBtnInfoModal,
    exitInviteGame, toggleFocusOut, removeAllEventListener
} from "./gameUtils.js";
import GameApp from "./gameApp.js";
import { GAME_TYPE } from "./gameTemplate.js";
import {player} from "../app.js";
import { GAME_WEBSOCKET } from '../Public/global.js';

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

        waitSocket.addEventListener('message', async e => {
            const data = JSON.parse(e.data);

            const {
                type,
                room_id,
                player: playerNumber,
                user_ids,
                waiting_number
            } = data;

            if (room_id !== undefined) {
                let userList= await getInfoPlayerList(user_ids);
                userList = orderPlayers(playerNumber, userList);

                openBoardModal(this, gameType, userList);
                if (gameType !== GAME_TYPE.TWO_PLAYER) {
                    this._boardContainer.querySelector('.modal__ready-btn').remove();
                }
                this._enterGameRoom(room_id, gameType, userList, playerNumber);
            } else if (type === "send_waiting_number") {
                setupConnectPeopleAtMatchingModal(this._matchingContainer, waiting_number);
            }
        });

        waitSocket.onopen = () => {
            const data = {
                'token': player._token
            }

            this._waitSend(data);
        }

        waitSocket.onerror = () => {
            openInfoModal('There was a problem with the game server.');
        }

        waitSocket.onclose = () => {
            closeMatchingModal(this._matchingContainer, this);
        }

        this._waitSocket = waitSocket;
    }

    localPlay() {
        const userList = [player.getInfo(), generateGuest('GUEST', [player.getProfile()])];

        openBoardModal(this, GAME_TYPE.TWO_PLAYER, userList);
        this._enterGameRoom(`local/${crypto.randomUUID()}`, GAME_TYPE.TWO_PLAYER, userList);
    }

    inviteGameRoom(room_id, userList, chatApp) {
        const gameSocket = new WebSocket(`${GAME_WEBSOCKET}/ws/game/${room_id}/`);
        console.log(`enter the room id: ${room_id}`);
        this._matchingContainer = openInfoModal('Waiting for user', false);
        this._matchingContainer.querySelector('.matching-game__wrapper span').classList.add('ingAnimation');
        exitInviteGame(this._matchingContainer, this, chatApp, userList[1]);

        gameSocket.addEventListener('message', async e => {
            const data = JSON.parse(e.data);

            if (data.type === 'send_system_message') {
                if (data.message === 'Game Ready') {
                    if (data.counter === 10) {
                        removeExitBtnInfoModal(this._matchingContainer);
                        this._matchingContainer.querySelector('.matching-game__wrapper span').classList.remove('ingAnimation');
                        setCommentInfoModal(this._matchingContainer, `Start for ${data.counter - 5}s`);
                    } else if (5 < data.counter) {
                        setCommentInfoModal(this._matchingContainer, `Start for ${data.counter - 5}s`);
                    } else if (data.counter === 5) {
                        openPlayGameModal(this, GAME_TYPE.RANDOM, userList);
                        this._gameApp = new GameApp(this._gameCanvas, GAME_TYPE.RANDOM);
                        this._gameApp.setPlayer(data.player);

                        this._matchingContainer.remove();
                        this._matchingContainer = undefined;

                        this._gameApp.renderConter(data.counter);
                    } else if (data.counter < 5) {
                        this._gameApp.renderConter(data.counter);
                    }
                } else if (data.message === 'Game Start') {
                    this._gameApp.renderConter(data.counter);

                    this._gameContiner.addEventListener('keydown', e => {
                        if (e.key === 'ArrowLeft') this._gameSend({'move': 'up'});
                        else if (e.key === 'ArrowRight') this._gameSend({'move': 'down'});
                        else if (e.keyCode === 67) this._gameApp.toggleCamera();
                    });

                    this._gameContiner.addEventListener('keyup', e => {
                        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') this._gameSend({'move': 'stop'});
                    });
                } else if (data.message === 'Game End') {
                    toggleFocusOut(this._gameCanvas, false);
                    renderEndStatus(this._gameCanvas, this._gameApp.getPlayer(), data.score, GAME_TYPE.RANDOM);
                    changeGiveUpToEnd(this._gameContiner);
                }
            } else if (data.type === 'send_game_status') {
                this._gameApp.dataRander(data);
            }
        });

        gameSocket.onopen = () => {
            this.readyToPlay();
        }

        gameSocket.onerror = () => {
            this._matchingContainer.remove();
            this.gameClose();
            openInfoModal('There was a problem with the game server.');
        }

        this._gameSocket = gameSocket;
    }

    _enterGameRoom(room_id, gameType, userList) {
        const gameSocket = new WebSocket(`${GAME_WEBSOCKET}/ws/game/${room_id}/`);
        console.log(`enter the room id: ${room_id}`);

        gameSocket.addEventListener('message', async e => {
            const data = JSON.parse(e.data);

            if (data.type === 'send_system_message') {
                if (data.message === 'Game Ready') {
                    if (5 < data.counter) {
                        setInfoMessageAtModal(this._boardContainer, data.counter - 5);
                    } else if (data.counter === 5) {
                        openPlayGameModal(this, gameType, userList);
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
                        openPlayGameModal(this, gameType, userList);
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
                    toggleFocusOut(this._gameCanvas, false);
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
           openInfoModal('There was a problem with the game server.');
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

    cancelRenderGameApp() {
        this._gameApp.cancelRender();
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
