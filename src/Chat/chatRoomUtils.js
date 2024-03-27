import {FRONTEND, GAME_WEBSOCKET} from "../Public/global.js";
import { routes } from "../route.js";
import {friendModalClick, modalRender, setAvatar} from "../Profile/modalUtils.js";
import Player from "../Login/player.js";
import {CHATLOG_PREFIX, renderChatBox, showChatList} from "./chatPageUtils.js";
import {readChatLog} from "./chatSocketUtils.js";

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
function loadChatLog(chatContainer, userId) {
    const chatLog = getChatLog(userId);
    chatLog.forEach(log => {
        renderChatBox(chatContainer, log);
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
    * userData: {
    *   id: <int>,
    *   nickname: <string>,
    *   profile: <string>,
    *   status_message: <string>,
    *   win: <int>,
    *   lose: <int>,
    *   rank: <int>,
    *   is_friend: <boolean>,
    * }
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

        loadChatLog(chatContainer, userData.id);

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
        readChatLog(userData.id);
        await showChatList(chatApp);
    } catch(e) {
        // TODO: error modal
    }
}
