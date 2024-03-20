import { EXPIRY, chatTokenKey } from "../Public/global.js";
import { routes } from "../route.js";
import { chatSocket } from "../Login/loginUtils.js";
import { showChatList, chatListOnclick } from "./chatPageUtils.js";

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
            'token' : localStorage.getItem(chatTokenKey),
        }));
    };

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        const fromToken = data.from.slice(0, -8); // token_test_id에서 _test_id 제거
        // successfully logged in 메시지는 from이 없어서 에러뜸, 추후 지우기 ㅎㅎ
        // const exp = new Date().getTime() + EXPIRY * 24 * 60 * 60 * 1000;
        const exp = "1111";
        
        let chatSide;
        let chatId;
        if (fromToken === localStorage.getItem(chatTokenKey)) {
            chatSide = "me";
            chatId = document.querySelector(".chat__header--name").innerText;
        } else {
            chatSide = "you";
            chatId = fromToken;
        }

        const newMsgObj = {
            from: chatSide,
            msg: data.message,
            time: data.time,
            exp: exp,
        };
        saveNewMsg(`chatLog_${chatId}`, newMsgObj);
        updateChatLog(newMsgObj);
        updateChatList();
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
}