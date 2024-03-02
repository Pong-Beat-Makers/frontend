import { BACKEND, FRONTEND, EXPIRY, chatTokenKey } from "../Public/global.js";
import { routes } from "../route.js";
import { chatSocket } from "../app.js";
import { showChatList, showSearchResult } from "./chatPageUtils.js";

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
    2. 로컬스토리지 데이터 바탕으로 채팅방 검색기능 구현
    3. 메시지 보낸지 24시간 지나면 해당 채팅방 재접속 시 데이터 삭제
    4. 코드 분리
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

// 로그의 처음부터 끝까지 출력이라 처음에 채팅창 열 때 한번만 호출해야 함
function loadChatLog(chatId) {
    const chatFrame = document.querySelector(".chat__body--frame");

    let chatLog = localStorage.getItem(chatId);
    if (!chatLog)
        return ;

    chatLog = JSON.parse(chatLog);
    for (let i = 0; i < chatLog.length; i++) {
            chatFrame.innerHTML += routes["/chat"].chatBoxTemplate(
                `message_${chatLog[i].from}`, chatLog[i].msg, chatLog[i].time);
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
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
}

function handleInvite() {
    const targetToken = document.querySelector(".chat__header--name").innerHTML;
    const roomAddress = `${FRONTEND}/game/${crypto.randomUUID()}`;

    chatSocket.send(JSON.stringify({
        'target_nickname' : `${targetToken}_test_id`,
        'message': `${localStorage.getItem(chatTokenKey)}_test_id invited you to a game!\n
        ${roomAddress}`
    }));
    // 추후 식별 가능 문자열로 바꿔서 이 메시지 받으면 게임 참여하기 버튼으로 바뀌게 하기 !
    window.location.href(roomAddress);
}

function handleBlockToggle() {
    const targetToken = document.querySelector(".chat__header--name").innerHTML;
    const blockToggleBtn = document.querySelectorAll(".chat__header--btn")[1];
    const blockIcon = `<i class="bi bi-person-slash"></i>`;
    
    let methodSelected;

    if (blockToggleBtn.classList.contains("block")) {
        blockToggleBtn.classList.replace("block", "unblock");
        blockToggleBtn.innerHTML = `${blockIcon} Unblock`;
        methodSelected = 'POST';
        chatSocket.send(JSON.stringify({
            'target_nickname' : `${targetToken}_test_id`,
            'message': `${targetToken}_test_id is now blocked by ${localStorage.getItem(chatTokenKey)}_test_id ❤️`
        }));
    }
    else {
        blockToggleBtn.innerHTML = `${blockIcon} Block`;
        methodSelected = 'DELETE';
    }

    const data = {
      method: methodSelected,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(chatTokenKey)}`,
      },
      body: JSON.stringify({
        'target_nickname' : `${targetToken}_test_id`,
      })
    };
    
    fetch(`${BACKEND}/blockedusers/`, data); // 예외처리 필요
}

function showChatroom(tokenInput) {
    const chatModal = document.querySelector(".chat__modal");
    chatModal.style.display = "block";

    const blockIcon = `<i class="bi bi-person-slash"></i>`;

    // 이미 차단된 사람인지 체크 => 내부 창 block 버튼 unblock으로 바꾸기 위해
    fetch(`${BACKEND}/blockedusers/?target_nickname=${tokenInput}_test_id`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(chatTokenKey)}`,
        },
    })
    .then(response => {
        if (!response.ok)
        throw new Error(`Error : ${response.status}`);
    return  response.json();
    })
    .then(data => {
        if (data.is_blocked === true) {
            const blockToggleBtn = document.querySelectorAll(".chat__header--btn")[1];
            blockToggleBtn.innerHTML = `${blockIcon} Unblock`;
            blockToggleBtn.classList.replace("block", "unblock");
        }
    });
/*
    chatSocket.send(JSON.stringify({
        'target_nickname' : `${tokenInput}_test_id`,
        'message': `${localStorage.getItem(chatTokenKey)} has successfully connected to ${tokenInput}`
    }));
*/
    chatModal.innerHTML += routes["/chat"].modalTemplate();
    document.querySelector(".chat__header--name").innerHTML = tokenInput;

    document.querySelector(".chat__header--close").onclick = function() {
		chatModal.style.display = "none";
        chatModal.innerHTML -= document.querySelector(".chat__container");
	}

    loadChatLog(`chatLog_${tokenInput}`);
    handleChatRoom();
}

// 검색창 내부 input 달라질 때마다 호출되는 함수
function checkChatroomSearch(event) {
    const chatSearchInput = document.querySelector(".chat__search input");
    if (chatSearchInput.value)
        showSearchResult(chatSearchInput.value);
    else
        showChatList();
}

export function setChatPage() {
    showChatList();

    const chatSearchBtn = document.querySelector(".chat__search");
    chatSearchBtn.onsubmit = function (e) {
        e.preventDefault();
    }
    chatSearchBtn.oninput = checkChatroomSearch;

    const openModalBtn = document.querySelectorAll(".chat__room");
    for (let i = 0; i < openModalBtn.length; i++) {
        openModalBtn[i].onclick = function() {
            showChatroom(openModalBtn[i].querySelector(".chat__room--name").innerText);
        }
    }
}

function handleChatRoom() {
    const chatHeaderBtns = document.querySelectorAll(".chat__header--btn");
    chatHeaderBtns[0].onclick = handleInvite;
    chatHeaderBtns[1].onclick = handleBlockToggle;

    // document.querySelector('.chat__controller--text').focus();
    document.querySelector('.chat__body--text').onkeydown = function(e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('.chat__controller--btn').click();
        }
    };

    document.querySelector('.chat__send--btn').onclick = function(e) {
        const messageInputDom = document.querySelector('.chat__body--text');
        const targetToken = document.querySelector('.chat__header--name').innerHTML;
        const message = messageInputDom.value;
        const obj = {
            'target_nickname' : `${targetToken}_test_id`,
            'message': message
        };
        chatSocket.send(JSON.stringify(obj));
        messageInputDom.value = '';
    };
}