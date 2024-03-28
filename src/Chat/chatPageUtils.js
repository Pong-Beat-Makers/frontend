import { routes } from "../route.js";
import { showChatroom } from "./chatRoomUtils.js";
import {player} from "../app.js";
import {setAvatar} from "../Profile/modalUtils.js";
import {closedChatLog, getChatLog, getOpponent, saveNewMsg} from "./chatSocketUtils.js";
import SocketApp from "../Game/SocketApp.js";

export const CHATLOG_PREFIX = 'chatLog_';

function getLastObj(chatId) {
    const valueAll = JSON.parse(localStorage.getItem(chatId));
    const lastObj = valueAll[valueAll.length - 1];
    return lastObj;
}

export function renderChatBox(chatContainer, newMsgObj, chatApp, isNew = false) {
    /*
    * newMsgObj: {
    *   type: <string>,
    *   from_id: <int>,
    *   to_id: <int>,
    *   message: <string>,
    *   time: <string>,
    *   isClose: <boolean>,
    *   isRead: <boolean>
    * }
    * */
    const frameNode = chatContainer.querySelector('.chat__body--frame');

    const msgTime = new Date(newMsgObj.time);
    const chatBoxNode = document.createElement('div');
    chatBoxNode.classList.add('chatbox', `message_${player.getId() === newMsgObj.from_id? 'me':'you'}`);

    chatBoxNode.innerHTML += routes["/chat"].chatBoxTemplate(newMsgObj.message?newMsgObj.message:'', `${msgTime.getHours()}:${msgTime.getMinutes()>10?msgTime.getMinutes():'0' + msgTime.getMinutes()}`);

    frameNode.appendChild(chatBoxNode);
    if (newMsgObj.type === 'invite_game') {
        if (newMsgObj.status === 'invite') {
            const messageNode = chatBoxNode.querySelector('.chatbox__message');
            const inviteBtn = document.createElement('button');

            inviteBtn.classList.add('chatbox__invite-btn');
            inviteBtn.innerText = "Join the Game";

            if (newMsgObj.closed) {
                inviteBtn.disabled = true;
            }

            messageNode.appendChild(inviteBtn);

            inviteBtn.onclick = async () => {
                const userDetail = await player.getUserDetail(getOpponent(newMsgObj));
                const socketApp = SocketApp;

                socketApp.inviteGameRoom(newMsgObj.room_id, [player.getInfo(), userDetail], chatApp);
                closedChatLog(userDetail.id, chatApp);
            }
        } else if (newMsgObj.status === 'cancel') {
            chatBoxNode.remove();

            const cancelMessageNode = document.createElement('div');
            cancelMessageNode.classList.add('chatbox__system');

            cancelMessageNode.innerHTML = 'User Canceled The Game';

            frameNode.appendChild(cancelMessageNode);
        }
    }
    frameNode.scrollTop = frameNode.scrollHeight;
    if (isNew) {
        saveNewMsg(newMsgObj);
    }
}

export function renderSystemChatBox(app, message, userId) {
    const chatContainers = app.querySelectorAll('.chat__container');

    chatContainers.forEach(container => {
        if (Number(container.id) === userId) {
            // TODO: system message render
            const frameNode = container.querySelector('.chat__body--frame');

            frameNode.innerHTML += routes['/chat'].systemChatBoxTemplate(message);
            frameNode.scrollTop = frameNode.scrollHeight;
        }
    });
}

export async function renderChatRoom(chatRoomList, lastObj, chatApp) {
    /*
    * lastObj : {
    *   type: <string>,
    *   from_id: <int>,
    *   to_id: <int>,
    *   message: <string>,
    *   time: <string>,
    *   isRead: <boolean>
    * }
    * */
    if (lastObj === undefined) {
        return ;
    }

    try {
        const userDetail = await player.getUserDetail(getOpponent(lastObj));

        const chatRoomItem = document.createElement('div');
        chatRoomItem.classList.add('chat__room');

        const msgTime = new Date(lastObj.time);

        if (lastObj.type === 'invite_game') {
            lastObj.message = `${userDetail.nickname} invite you!`;
        }

        chatRoomItem.innerHTML = routes['/chat'].chatRoomTemplate(userDetail.nickname, lastObj.message, `${msgTime.getHours()}:${msgTime.getMinutes()>10?msgTime.getMinutes():'0' + msgTime.getMinutes()}`);

        const avatar = chatRoomItem.querySelector('.chat__room--profile');

        setAvatar(userDetail.profile, avatar);

        if (!lastObj.isRead) {
            chatRoomItem.classList.add('chat__room--no-read');
        }

        chatRoomList.appendChild(chatRoomItem);

        chatRoomItem.addEventListener('click', async () => {
            await showChatroom(chatApp, userDetail);
        });
    } catch (e) {
        // TODO: error msg
    }

}

export async function showChatList(chatApp) {
    const chatRoomList = chatApp.getApp().querySelector(".chat__room--list");

    if (chatRoomList !== null) {
        chatRoomList.innerHTML = "";
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(CHATLOG_PREFIX)) {
                await renderChatRoom(chatRoomList, getLastObj(key), chatApp);
            }
        }
        if (chatRoomList.innerHTML === "")
            chatRoomList.innerHTML = `<div class="chat__search--error">
        You haven't started chatting!
        </div>`
    }
}

async function getChatLogByKeyword(keyword) {
    if (keyword.length <= 0) {
        return [];
    }

    try {
        const searchUsers = await player.searchUser(keyword);
        return getChatLog(searchUsers);
    } catch (e) {
        // TODO: error modal
    }
    return [];
}

async function showSearchResult(keyword, chatApp) {
    const chatRoomList = chatApp.getApp().querySelector(".chat__room--list");
    const keywordRoomData = await getChatLogByKeyword(keyword);

    chatRoomList.innerHTML = "";
    if (keywordRoomData.length > 0) {
        keywordRoomData.forEach(roomData => {
            renderChatRoom(chatRoomList, roomData.chatLog, chatApp);
        });
    } else {
        chatRoomList.innerHTML = `<div class="chat__search--error">
        Nothing found for ${keyword}
        </div>`
    }
}

// 검색창 내부 input 달라질 때마다 호출되는 함수
async function checkChatroomSearch(chatApp) {
    const chatSearchInput = chatApp.getApp().querySelector("#chat__search--input");

    if (chatSearchInput !== null && chatSearchInput.value.length > 0)
        await showSearchResult(chatSearchInput.value, chatApp);
    else
        await showChatList(chatApp);
}

export async function setChatPage(chatApp) {
    await showChatList(chatApp);

    const chatSearchBtn = chatApp.getApp().querySelector(".chat__search");
    chatSearchBtn.onsubmit = function (e) {
        e.preventDefault();
    }
    chatSearchBtn.onkeyup = async () => {
        await checkChatroomSearch(chatApp);
    };
}