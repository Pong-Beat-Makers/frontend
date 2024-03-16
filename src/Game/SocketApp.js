import {BACKEND} from "../Public/global.js";
import {closeMatchingModal, openPlayGameModal, setupName} from "./gameUtils.js";
import GameApp from "./gameApp.js";

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
    }

    randomMatching() {
        const waitSocket = new WebSocket(`ws://${GAME_SERVER_DOMAIN}/ws/game/waitingroom/random/`);

        waitSocket.addEventListener('message', e => {
            const data = JSON.parse(e.data);

            closeMatchingModal(this);
            this._gameContiner = openPlayGameModal(this);

            setupName(this._gameContiner, data.user_nicknames[0], data.user_nicknames[1]);
            this._gameCanvas = this._gameContiner.querySelector('#game_playground');
            this._enterGameRoom(data.room_id);
        });

        waitSocket.onopen = () => {
            const data = {
                'token': getCookie("token")
            }

            this._waitSend(data);
        }

        this._waitSocket = waitSocket;
    }

    _enterGameRoom(room_id) {
        const gameSocket = new WebSocket(`ws://${GAME_SERVER_DOMAIN}/ws/game/${room_id}/`);
        console.log(`enter the room id: ${room_id}`);

        gameSocket.addEventListener('message', e => {
            const data = JSON.parse(e.data);

            if (data.type === 'send_system_message') {
                if (data.message === 'Game Start') {
                    this._gameApp = new GameApp(this._gameCanvas);
                    this._gameApp.setPlayer(data.player);
                }
            } else if (data.type === 'send_game_status') {
                this._gameApp.dataRander(data);
            }
        });

        this._gameContiner.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') this._gameSend({'move': 'up'});
            else if (e.key === 'ArrowRight') this._gameSend({'move': 'down'});
        });
        this._gameContiner.addEventListener('keyup', e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') this._gameSend({'move': 'stop'});
        });

        gameSocket.onopen = () => {
            const data = {
                'token': getCookie("token")
            }

            this._gameSend(data);
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
        this._waitSocket.close();
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
        this._gameSocket.close();
    }
}

export default new SocketApp();