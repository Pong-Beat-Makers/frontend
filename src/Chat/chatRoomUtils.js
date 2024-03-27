import { routes } from "../route.js";
import {friendModalClick, modalRender, setAvatar} from "../Profile/modalUtils.js";
import {CHATLOG_PREFIX, renderChatBox, showChatList} from "./chatPageUtils.js";
import {closedChatLog, readChatLog} from "./chatSocketUtils.js";

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
export function loadChatLog(chatContainer, userId, chatApp) {
    const frameNode = chatContainer.querySelector('.chat__body--frame');

    if (frameNode !== null) {
        frameNode.innerHTML = "";

        const chatLog = getChatLog(userId);
        chatLog.forEach(log => {
            renderChatBox(chatContainer, log, chatApp);
        });
    }
}

function handleInvite(chatApp, userData) {
    /*
    * userData: {id: <string>, nickname: <string>, profile: <string>}
    * */
    chatApp.inviteGame(userData.id);
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
        readChatLog(userData.id);
        await showChatList(chatApp);
    } catch(e) {
        // TODO: error modal
    }
}
