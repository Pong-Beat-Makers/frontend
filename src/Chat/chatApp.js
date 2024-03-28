import {player} from "../app.js";
import {CHAT_API_DOMAIN, CHAT_SERVER_DOMAIN, CHAT_WEBSOCKET} from "../Public/global.js";
import {
    findItemFromFriendList,
    setFriendStatus,
    setupFriendListStatus
} from "../Profile/modalUtils.js";
import {renderSystemChatBox} from "./chatPageUtils.js";
import {closedChatLog, getOpponent, processMessage, processNextMatch, processSystemMessage} from "./chatSocketUtils.js";
import {SOCKET_STATE} from "../Game/SocketApp.js";
import SocketApp from "../Game/SocketApp.js";

const CHAT_API = `${CHAT_SERVER_DOMAIN}/${CHAT_API_DOMAIN}`;

class ChatApp {
    constructor(app) {
        this._app = app;
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

            if (data.type === 'system_message') {
                if (data.message === 'You have successfully logged') {
                    this._friendsOnline = data.online_friends;
                    delete data.online_friends;

                    setupFriendListStatus();
                } else if (data.message === 'Next Match') {
                    const room_id = data.room_id;
                    delete data.room_id;

                    await processNextMatch(this);
                    const userDetail = await player.getUserDetail(data.opponent_id);
                    const socketApp = SocketApp;

                    socketApp.closeGameModal();
                    socketApp.inviteGameRoom(room_id, [player.getInfo(), userDetail], this);
                } else if (data.error === 'No User or Offline') {
                    // TODO: offline message
                    renderSystemChatBox(this._app, 'Offline User', data.from_id);
                    return;
                }
                await processSystemMessage(this, data);
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
            } else if (data.type === 'invite_game') {
                /*
                * type: <string>,
                * from_id: <int>,
                * to_id: <int>,
                * room_id: <string>,
                * time: <string>
                * */
                // TODO: Blocked User 에게도 보내짐
                closedChatLog(getOpponent(data), this);
                await processMessage(this, data);

                if (data.status === 'invite' && player.getId() === data.from_id) {
                    closedChatLog(getOpponent(data), this);

                    const userDetail = await player.getUserDetail(getOpponent(data));
                    const socketApp = SocketApp;

                    socketApp.inviteGameRoom(data.room_id, [player.getInfo(), userDetail], this);
                }
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

    inviteGame(userId) {
        /*
        *   "target_id": "<초대하고자 하는 대상 id>",
        *   "type" : "invite_game",
        *   "status: "invite"
        * */
        this._send({target_id: userId, type: "invite_game", status: 'invite'});
    }

    cancelInviteGame(userId) {
        /*
        *   "target_id": "<초대하고자 하는 대상 id>",
        *   "type" : "invite_game",
        *   "status: "cancel"
        * */
        this._send({target_id: userId, type: "invite_game", status: 'cancel'});
    }

    sendMessage(userId, message) {
        this._send({target_id: userId, message});
    }

    _send(data) {
        if (this.isState() === SOCKET_STATE.OPEN) {
            this._chatSocket.send(JSON.stringify(data));
        }
    }

    setFriendListNode(friendListNode) {
        this._friendListNode = friendListNode;
    }

    isState() {
        if (this._chatSocket !== undefined)
            return this._chatSocket.readyState;
        return SOCKET_STATE.CLOSED;
    }

    getApp() {
        return this._app;
    }

    getFriendListNode() {
        return this._friendListNode;
    }

    getFriendsOnline() {
        return this._friendsOnline;
    }
}

export default ChatApp;