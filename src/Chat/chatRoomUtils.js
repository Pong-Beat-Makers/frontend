import { FRONTEND, CHAT_API_DOMAIN, CHAT_SERVER_DOMAIN } from "../Public/global.js";
import { routes } from "../route.js";
import { chatSocket } from "../Login/loginUtils.js";
import {modalRender} from "../Profile/modalUtils.js";
import Player from "../Login/player.js";

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

function handleInvite() {
    const targetNickname = document.querySelector(".chat__header--name").innerHTML;
    const roomAddress = `${FRONTEND}/game/${crypto.randomUUID()}`;

    chatSocket.send(JSON.stringify({
        'target_nickname' : targetNickname,
        'message': `${Player._nickName} invited you to a game!\n
        ${roomAddress}`
    }));
    // 추후 식별 가능 문자열로 바꿔서 이 메시지 받으면 게임 참여하기 버튼으로 바뀌게 하기 !
    window.location.href(roomAddress);
}

function handleBlockToggle() {
    const targetNickname = document.querySelector(".chat__header--name").innerHTML;
    const blockToggleBtn = document.querySelectorAll(".chat__header--btn")[1];
    const blockIcon = `<i class="bi bi-person-slash"></i>`;
    
    let methodSelected;

    if (blockToggleBtn.classList.contains("block")) {
        blockToggleBtn.classList.replace("block", "unblock");
        blockToggleBtn.innerHTML = `${blockIcon} Unblock`;
        methodSelected = 'POST';
        chatSocket.send(JSON.stringify({
            'target_nickname' : targetNickname,
            'message': `${targetNickname} is now blocked by ${Player._nickName} ❤️`
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
                'Authorization': `Bearer ${Player._token}`,
            },
            body: JSON.stringify({
                'target_nickname' : targetNickname,
        })
    };
    
    fetch(`${CHAT_SERVER_DOMAIN}/${CHAT_API_DOMAIN}/blockedusers/`, data); // 예외처리 필요
}

export async function showChatroom(toNickname) {
    modalRender("chat", routes["/chat"].modalTemplate());

    const blockIcon = `<i class="bi bi-person-slash"></i>`;

    const response = await fetch(`${CHAT_SERVER_DOMAIN}/${CHAT_API_DOMAIN}/blockedusers/?target_nickname=${toNickname}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${Player._token}`,
        },
    });
    if (!response.ok)
        throw new Error(`Error : ${response.status}`);
    
    const data = await response.json();
    if (data.is_blocked === true) {
        const blockToggleBtn = document.querySelectorAll(".chat__header--btn")[1];
        blockToggleBtn.innerHTML = `${blockIcon} Unblock`;
        blockToggleBtn.classList.replace("block", "unblock");
    };

    document.querySelector(".chat__header--name").innerHTML = toNickname;

    loadChatLog(`chatLog_${toNickname}`);
    handleChatRoom();
}

function handleChatRoom() {
    const chatHeaderBtns = document.querySelectorAll(".chat__header--btn");
    chatHeaderBtns[0].onclick = handleInvite;
    chatHeaderBtns[1].onclick = handleBlockToggle;

    const chatRoom = document.querySelector(".chat__body--frame");
    chatRoom.scrollTop = chatRoom.scrollHeight;
    
    document.querySelector('.chat__body--text').onkeydown = function(e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('.chat__controller--btn').click();
        }
    };

    document.querySelector('.chat__send--btn').onclick = function(e) {
        const messageInputDom = document.querySelector('.chat__body--text');
        const targetNickname = document.querySelector('.chat__header--name').innerHTML;
        const message = messageInputDom.value;
        const obj = {
            'target_nickname' : targetNickname,
            'message': message
        };
        chatSocket.send(JSON.stringify(obj));
        messageInputDom.value = '';
    };
}