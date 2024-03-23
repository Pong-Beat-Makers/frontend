import {FRONTEND, GAME_WEBSOCKET} from "../Public/global.js";
import { routes } from "../route.js";
import {friendModalClick, modalRender, setAvatar} from "../Profile/modalUtils.js";
import Player from "../Login/player.js";
import {CHATLOG_PREFIX, renderChatBox, showChatList} from "./chatPageUtils.js";

export function getChatLogList() {
    let data = [];

    for (let key in localStorage) {
        if (key.startsWith(CHATLOG_PREFIX)) {
            let log = {
                id: key.substring(CHATLOG_PREFIX.length),
                log: JSON.parse(localStorage.getItem(key))
            };
            data.push(log);
        }
    }
    return data;
}

function getChatLog(userId) {
    /*
    * return: [{
    *   from: <string>,
    *   from_id: <int>,
    *   message: <string>,
    *   time: <string>,
    *   isRead: <boolean>
    * }]
    * */
    const chatLog = localStorage.getItem(CHATLOG_PREFIX + userId);

    return chatLog ? JSON.parse(chatLog) : [];
}
function loadChatLog(chatContainer, userId, chatApp) {
    const chatLog = getChatLog(userId);
    chatLog.forEach(log => {
        renderChatBox(chatContainer, log, chatApp);
    });
    // localStorage.setItem(chatId, JSON.stringify(chatLog));
}

function handleInvite(chatApp, userData) {
    /*
    * userData: {id: <string>, nickname: <string>, profile: <string>}
    * */
    const roomAddress = `${GAME_WEBSOCKET}/ws/game/${crypto.randomUUID()}`;

    chatApp.sendMessage(userData.id, `<button class="chatbox__invite-btn" id="${crypto.randomUUID()}">invite</button>`);
    // 추후 식별 가능 문자열로 바꿔서 이 메시지 받으면 게임 참여하기 버튼으로 바뀌게 하기 !
    // window.location.href(roomAddress);
}

async function handleBlockToggle(chatApp, userData, blockToggleBtn, isBlocked) {
    const blockIcon = `<i class="bi bi-person-slash"></i>`;
    try {
        await chatApp.userBlock(userData.id, isBlocked);

        if (isBlocked) {
            blockToggleBtn.innerHTML = `${blockIcon} Block`;
        } else {
            blockToggleBtn.innerHTML = `${blockIcon} Unblock`;
        }
        blockToggleBtn.onclick = () => {
            handleBlockToggle(chatApp, userData, blockToggleBtn, !isBlocked);
        };
    } catch (e) {
        // TODO: error modal
    }
}

export async function showChatroom(chatApp, userData) {
    /*
    * userData: {id: <string>, nickname: <string>, profile: <string>}
    * */
    const chatModal = modalRender("chat", routes["/chat"].modalTemplate());
    const chatContainer = chatModal.querySelector('.chat__container');
    const avatar = chatContainer.querySelector('.chat__header--avatar');
    const chatHeaderBtns = chatContainer.querySelectorAll(".chat__header--btn");
    const sendBtn = chatContainer.querySelector('.chat__send--btn');
    const msgInput = chatContainer.querySelector('.chat__body--text');

    chatContainer.id = userData.id;
    setAvatar(userData.profile, avatar);

    const data = await chatApp.isBlocked(userData.id);
    try {
        const blockIcon = `<i class="bi bi-person-slash"></i>`;

        if (data.is_blocked === true) {
            chatHeaderBtns[1].innerHTML = `${blockIcon} Unblock`;
            chatHeaderBtns[1].classList.replace("block", "unblock");
        }

        chatHeaderBtns[0].onclick = () => { handleInvite(chatApp, userData) };
        chatHeaderBtns[1].onclick = async e => { await handleBlockToggle(chatApp, userData, e.target, data.is_blocked) };

        chatModal.querySelector(".chat__header--name").innerHTML = userData.nickname;

        loadChatLog(chatContainer, userData.id, chatApp);

        sendBtn.addEventListener('click', e => {
            chatApp.sendMessage(userData.id, msgInput.value);
            msgInput.value = "";
        });

        msgInput.addEventListener('keydown', e => {
            if (e.keyCode === 13) {
                e.preventDefault();
                sendBtn.click();
            }
        });
        await showChatList(chatApp);
    } catch(e) {
        // TODO: error modal
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