import { EXPIRY, chatTokenKey } from "../Public/global.js";
import { routes } from "../route.js";
import { chatSocket } from "../app.js";
import { showChatList, chatListOnclick } from "./chatPageUtils.js";

/*
1. 메시지 받으면 로컬스토리지에 저장. 한 사람과의 대화 전체를 하나의 key로 저장. 
- key : chatLog_${token}
- value:
    {[from], [msg], [time], [exp]}, {[from], [msg], [time], [exp]}, {[from], [msg], [time], [exp]} ...

2. 채팅 목록 페이지는 로컬스토리지의 key를 참조하여 chat_${token} 개수만큼 생성.

3. 특정 채팅방 클릭 시 해당 token과의 채팅 목록 불러와서 채팅방 모달 띄움,
    내부 value개수만큼 말풍선 생성

4. 로그아웃 시 로컬스토리지, 쿠키의 모든 데이터 삭제

TODO: 
    1. 채팅방 목록 띄울 때 최근 채팅 순서대로
    2. 메시지 보낸지 24시간 지나면 해당 채팅방 재접속 시 데이터 삭제
    4. 채팅, 차단, 검색 모두 테스트 후 머지
    5. 모달 & 검색창 css 수정
*/

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