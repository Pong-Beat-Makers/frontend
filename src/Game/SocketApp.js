import {BACKEND} from "../Public/global.js";
import {
    closeMatchingModal,
    openTournamentModal,
    openVersusModal,
    setupAvatorAtTournament,
    setupActiveReadyBtn, openPlayGameModal
} from "./gameUtils.js";
import GameApp from "./gameApp.js";
import { GAME_TYPE } from "./gameTemplate.js";

const GAME_SERVER_DOMAIN = 'localhost:8001';

export const SOCKET_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

class SocketApp {
    constructor() {
        this._waitSocket = undefined;
        this._gameSocket = undefined;
        this._gameContiner = undefined;
        this._boardContainer = undefined;
        this._gameCanvas = undefined;
    }

    readyToPlay() {
        const data = {
            'token': getCookie("token")
        }
        if (this.isGameState() === SOCKET_STATE.OPEN) {
            this._gameSend(data);
        }
    }

     randomMatching() {
        const waitSocket = new WebSocket(`ws://${GAME_SERVER_DOMAIN}/ws/game/waitingroom/random/`);

        waitSocket.addEventListener('message', e => {
            const data = JSON.parse(e.data);

            closeMatchingModal(this);
            openVersusModal(this, data.user_nicknames);
            this._enterGameRoom(data.room_id, data.user_nicknames);
        });

        waitSocket.onopen = () => {
            const data = {
                'token': getCookie("token")
            }

            this._waitSend(data);
        }

        this._waitSocket = waitSocket;
    }

    tournamentMatching() {
        const waitSocket = new WebSocket(`ws://${GAME_SERVER_DOMAIN}/ws/game/waitingroom/tournament/`);

        waitSocket.addEventListener('message', e => {
            const data = JSON.parse(e.data);

            closeMatchingModal(this);
        });

        waitSocket.onopen = () => {
            const data = {
                'token': getCookie('token')
            }

            this._waitSocket(data);
        }

        this._waitSocket = waitSocket;
    }

    _enterGameRoom(room_id, playerNames) {
        const gameSocket = new WebSocket(`ws://${GAME_SERVER_DOMAIN}/ws/game/${room_id}/`);
        console.log(`enter the room id: ${room_id}`);

        gameSocket.addEventListener('message', e => {
            const data = JSON.parse(e.data);

            if (data.type === 'send_system_message') {
                if (data.message === 'Game Start') {
                    this._boardContainer.remove();
                    this._boardContainer = undefined;

                    openPlayGameModal(this, GAME_TYPE.RANDOM, playerNames);
                    this._gameApp = new GameApp(this._gameCanvas);
                    this._gameApp.setPlayer(data.player);

                    this._gameContiner.addEventListener('keydown', e => {
                        if (e.key === 'ArrowLeft') this._gameSend({'move': 'up'});
                        else if (e.key === 'ArrowRight') this._gameSend({'move': 'down'});
                    });

                    this._gameContiner.addEventListener('keyup', e => {
                        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') this._gameSend({'move': 'stop'});
                    });
                }
            } else if (data.type === 'send_game_status') {
                this._gameApp.dataRander(data);
            }
        });

       gameSocket.onopen = () => {
           setupActiveReadyBtn(this._boardContainer);
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
        this._gameSocket.send(JSON.stringify(data));
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

    setBoardContainer(boardContainer) {
        this._boardContainer = boardContainer;
    }

    setGameCanvas(gameCanvas) {
        this._gameCanvas = gameCanvas;
    }
}

export default new SocketApp();