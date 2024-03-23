import { FRONTEND, CHAT_API_DOMAIN, CHAT_SERVER_DOMAIN } from "../Public/global.js";
import { routes } from "../route.js";
import { chatSocket } from "../Login/loginUtils.js";
import {friendModalClick, modalRender} from "../Profile/modalUtils.js";
import Player from "../Login/player.js";
import ProfileModal from "../Profile/profileModalTemplate.js";
import { showChatList, chatListOnclick } from "./chatPageUtils.js";

function loadChatLog(chatModal, chatId) {
    const chatFrame = chatModal.querySelector(".chat__body--frame");

    let chatLog = localStorage.getItem(chatId);
    if (!chatLog)
        return ;

    chatLog = JSON.parse(chatLog);
    for (let i = 0; i < chatLog.length; i++) {
        chatFrame.innerHTML += routes["/chat"].chatBoxTemplate(
            `message_${chatLog[i].from}`, chatLog[i].msg, chatLog[i].time);
        chatLog[i].isRead = true;
    }
    localStorage.setItem(chatId, JSON.stringify(chatLog));
}

function handleInvite(chatModal) {
    const targetNickname = chatModal.querySelector(".chat__header--name").innerHTML;
    const roomAddress = `${FRONTEND}/game/${crypto.randomUUID()}`;

    chatSocket.send(JSON.stringify({
        'target_nickname' : targetNickname,
        'message': `${Player._nickName} invited you to a game!\n
        ${roomAddress}`
    }));
    // 추후 식별 가능 문자열로 바꿔서 이 메시지 받으면 게임 참여하기 버튼으로 바뀌게 하기 !
    window.location.href(roomAddress);
}

async function handleBlockToggle(chatModal) {
    const targetNickname = chatModal.querySelector(".chat__header--name").innerHTML;
    const blockToggleBtn = chatModal.querySelectorAll(".chat__header--btn")[1];
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
    
    const res = await fetch(`${CHAT_SERVER_DOMAIN}/${CHAT_API_DOMAIN}/blockedusers/`, data);
    if (!res.ok)
        throw new Error(`Error : ${res.status}`);
}

export async function showChatroom(toNickname) {
    const chatModal = modalRender("chat", routes["/chat"].modalTemplate());

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
        const blockToggleBtn = chatModal.querySelectorAll(".chat__header--btn")[1];
        blockToggleBtn.innerHTML = `${blockIcon} Unblock`;
        blockToggleBtn.classList.replace("block", "unblock");
    };

    chatModal.querySelector(".chat__header--name").innerHTML = toNickname;

    loadChatLog(chatModal, `chatLog_${toNickname}`);
    handleChatRoom(chatModal, toNickname);
    try {
        showChatList();
        chatListOnclick();
    }
    catch {
    }
}

async function handleChatRoom(chatModal, toNickname) {
    const targetProfile = chatModal.querySelector(".chat__header--profile");
    targetProfile.onclick = async () => {
        // const detailProfileModal = modalRender('detailed-profile', ProfileModal.friendModalTemplate());
        // await showProfileDetail(detailProfileModal, toNickname);
        await friendModalClick(toNickname);
    }

    const chatHeaderBtns = chatModal.querySelectorAll(".chat__header--btn");
    chatHeaderBtns[0].onclick = () => { handleInvite(chatModal) };
    chatHeaderBtns[1].onclick = async () => { await handleBlockToggle(chatModal) };

    const chatRoom = chatModal.querySelector(".chat__body--frame");
    chatRoom.scrollTop = chatRoom.scrollHeight;

    // TODO: 이거 작동 안하는듯 ; 고치기
    chatModal.querySelector('.chat__body--text').onkeydown = function(e) {
        if (e.keyCode === 13) {  // enter, return
            chatModal.querySelector('.chat__controller--btn').click();
        }
    };

    chatModal.querySelector('.chat__send--btn').onclick = function(e) {
        const messageInputDom = chatModal.querySelector('.chat__body--text');
        const targetNickname = chatModal.querySelector('.chat__header--name').innerHTML;
        const message = messageInputDom.value;
        const obj = {
            'target_nickname' : targetNickname,
            'message': message
        };
        chatSocket.send(JSON.stringify(obj));
        messageInputDom.value = '';
    };
}