import { routes } from "../route.js";
import { chatSocket, setFriendStatus } from "../Login/loginUtils.js";
import { showChatList, chatListOnclick } from "./chatPageUtils.js";
import Player from "../Login/player.js";

function saveNewMsg(chatId, newMsgObj) {
    let chatLog = localStorage.getItem(chatId);
    if (chatLog) {
        chatLog = JSON.parse(chatLog);
    } else {
        chatLog = [];
    }
    chatLog.push(newMsgObj);
    localStorage.setItem(chatId, JSON.stringify(chatLog));
}

function updateChatLog(newMsgObj) {
    try {
        const chatFrame = document.querySelector(".chat__body--frame");
        chatFrame.innerHTML += routes["/chat"].chatBoxTemplate(
            `message_${newMsgObj.from}`, newMsgObj.msg, newMsgObj.time);
    }
    catch {
    }
}

function updateChatList() {
    try {
        showChatList();
        chatListOnclick();
    }
    catch {
    }
}

export function initChatSocket() {
    chatSocket.onopen = function (e) {
        chatSocket.send(JSON.stringify({
            'token' : Player._token, // 실제 토큰 처리
        }));
    };

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        // 첫 로그인 성공 시
        if (data.type === undefined) {
            initFriendsStatus(data.online_friends);
            return;
        } else if (data.type === 'send_status') { // 실시간 반영
            updateFriendStatus([data.from_id, data.from], data.status);
            return;
        }

        // 채팅
        const fromNickname = data.from;
        let chatSide;
        let chatId;
        if (fromNickname === Player._nickName) {
            chatSide = "me";
            chatId = document.querySelector(".chat__header--name").innerText;
        } else {
            chatSide = "you";
            chatId = fromNickname;
        }

        const newMsgObj = {
            from: chatSide,
            msg: data.message,
            time: data.time,
        };
        saveNewMsg(`chatLog_${chatId}`, newMsgObj);
        updateChatLog(newMsgObj);
        updateChatList();
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
}

function initFriendsStatus(onlineFriendsList) {
    onlineFriendsList.forEach(element => {
        setFriendStatus(element, 'online');
    });
}

function updateFriendStatus(updatedFriend, status) {
    setFriendStatus(updatedFriend, status);
}
