import {player} from "../app.js";
import {CHAT_API_DOMAIN, CHAT_SERVER_DOMAIN, CHAT_WEBSOCKET} from "../Public/global.js";
import {
    findItemFromFriendList,
    setFriendStatus,
    setupFriendListStatus
} from "../Profile/modalUtils.js";
import {renderSystemChatBox} from "./chatPageUtils.js";
import {processMessage} from "./chatSocketUtils.js";
import {SOCKET_STATE} from "../Game/SocketApp.js";

const CHAT_API = `${CHAT_SERVER_DOMAIN}/${CHAT_API_DOMAIN}`;

class ChatApp {
    constructor(app) {
        this._app = app;
        this._friendListNode = app.querySelector('.profile-section__friends--list');
        this._friendsOnline = [];

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
                this._friendsOnline = data.online_friends;

                setupFriendListStatus(this._friendListNode, this._friendsOnline);
            } else if (data.type === 'send_status') {
                const friendItem = findItemFromFriendList(this._friendListNode, data.from_id);
                if (friendItem !== undefined) {
                    if (data.status === 'online'){
                        setFriendStatus(friendItem, true);
                    } else if (data.status === 'offline') {
                        setFriendStatus(friendItem, false);
                    }
                }
            } else if (data.type === 'chat_message') {
                /*
                * {
                *   type: "chat_message",
                *   from: <string>,
                *   from_id: <int>,
                *   to_id: <int>,
                *   message: <string>,
                *   time: <string>
                * }
                * */
                await processMessage(this, data);
            } else if (data.type === 'system_message') {
                if (data.error === 'No User or Offline') {
                    // TODO: offline message
                    renderSystemChatBox(this._app, 'Offline User', data.from_id);
                }
            } else if (data.type === 'invite_game') {
                /*
                * type: <string>,
                * from_id: <int>,
                * to_id: <int>,
                * room_id: <string>,
                * time: <string>
                * */
                await processMessage(this, data);
            }
        }

    }

    setFriendsOnline(friendListNode = this._friendListNode) {
        setupFriendListStatus(friendListNode, this._friendsOnline);
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

    inviteGame(userId) {
        /*
        *   "target_id": "<초대하고자 하는 대상 id>",
        *   "type" : "invite_game"
        * */
        this._send({target_id: userId, type: "invite_game"});
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