import {player} from "../app.js";
import {CHAT_API_DOMAIN, CHAT_SERVER_DOMAIN, CHAT_WEBSOCKET} from "../Public/global.js";
import {
    findItemFromFriendList,
    setFriendStatus,
    setupFriendListStatus
} from "../Profile/modalUtils.js";
import {processMessage} from "./chatSocketUtils.js";
import {SOCKET_STATE} from "../Game/SocketApp.js";

const CHAT_API = `${CHAT_SERVER_DOMAIN}/${CHAT_API_DOMAIN}`;

class ChatApp {
    constructor(app) {
        this._app = app;
        this._friendListNode = app.querySelector('.profile-section__friends--list');

        const chatSocket = new WebSocket(`${CHAT_WEBSOCKET}/ws/chatting/`);
        this._chatSocket = chatSocket;

        chatSocket.onopen = e => {
            this._send({token: player._token});
        }

        chatSocket.onerror = e => {
            console.error(e);
            // TODO: chatSocket error modal
        }

        chatSocket.onmessage = async e => {
            const data = JSON.parse(e.data);

            if (data.message === 'You have successfully logged') {
                const onlineFriendIds = data.online_friends;

                setupFriendListStatus(this._friendListNode, onlineFriendIds);
            } else if (data.type === 'send_status') {
                const friendItem = findItemFromFriendList(this._friendListNode, data.from_id);
                if (friendItem !== undefined) {
                    if (data.status === 'online'){
                        setFriendStatus(friendItem, true);
                    } else if (data.status === 'offline') {
                        setFriendStatus(friendItem, false);
                    }
                }
            } else if (data.type === 'chat_message'){
                // TODO: chatting data from말고 to도 받아야 할 듯 ..
                /*
                * {
                *   type: "chat_message",
                *   from: <string>,
                *   from_id: <int>,
                *   message: <string>,
                *   time: <string>
                * }
                * */
                if (data.error === 'No User or Offline') {
                    // TODO: offline message
                }
                await processMessage(this, app, data);
            }
        }

    }

    async userBlock(id, isBlocked) {
        const data = {target_id: id};
        if (!isBlocked) {
            const res = await player._getServer(`${CHAT_API}/blockedusers/`, 'POST', data);
            if (res.status !== 201) {
                throw {error: res.status};
            }
            this.sendMessage(id, `you are now blocked by ${player.getNickName()} ❤️`);
        } else {
            const res = await player._getServer(`${CHAT_API}/blockedusers/`, 'DELETE', data)
            if (res.status !== 200) {
                throw {error: res.status};
            }
        }
    }

    async isBlocked(id) {
        const res = await player._getServer(`${CHAT_API}/blockedusers/?target_id=${id}`);
        if (res.status !== 200) {
            throw {error: res.status};
        }
        return await res.json();
    }

    sendMessage(userId, message) {
        this._send({target_id: userId, message});
    }

    _send(data) {
        if (this.isState() === SOCKET_STATE.OPEN) {
            this._chatSocket.send(JSON.stringify(data));
        }
    }

    isState() {
        if (this._chatSocket !== undefined)
            return this._chatSocket.readyState;
        return SOCKET_STATE.CLOSED;
    }

    getApp() {
        return this._app;
    }
}

export default ChatApp;