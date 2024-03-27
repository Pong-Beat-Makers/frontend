import { routes } from "../route.js";
import { showChatroom } from "./chatRoomUtils.js";
import {player} from "../app.js";
import {setAvatar} from "../Profile/modalUtils.js";
import {getOpponent, saveNewMsg} from "./chatSocketUtils.js";

export const CHATLOG_PREFIX = 'chatLog_';

function getLastObj(chatId) {
    const valueAll = JSON.parse(localStorage.getItem(chatId));
    const lastObj = valueAll[valueAll.length - 1];
    return lastObj;
}

export function renderChatBox(chatContainer, newMsgObj, isNew = false) {
    /*
    * newMsgObj: {
    *   from_id: <int>,
    *   to_id: <int>,
    *   message: <string>,
    *   time: <string>,
    *   isRead: <boolean>
    * }
    * */
    const frameNode = chatContainer.querySelector('.chat__body--frame');

    const msgTime = new Date(newMsgObj.time);
    const chatBoxNode = document.createElement('div');
    chatBoxNode.classList.add('chatbox', `message_${player.getId() === newMsgObj.from_id? 'me':'you'}`);

    chatBoxNode.innerHTML += routes["/chat"].chatBoxTemplate(newMsgObj.message, `${msgTime.getHours()}:${msgTime.getMinutes()}`);
    frameNode.appendChild(chatBoxNode);

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

        chatRoomItem.innerHTML = routes['/chat'].chatRoomTemplate(userDetail.nickname, lastObj.message, `${msgTime.getHours()}:${msgTime.getMinutes()}`);

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

function showSearchResult(input) {
    const chatRoomList = document.querySelector(".chat__room--list");
    chatRoomList.innerHTML = "";
    let isFound = false;
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.includes(input) && key.startsWith("chatLog_")) {
            isFound = true;
            chatRoomList.innerHTML += routes["/chat"].chatRoomTemplate(
                key.slice(8),
                getLastObj(key).msg, getLastObj(key).time);
            }
        }
        if (isFound === false) {
            chatRoomList.innerHTML = `<div class="chat__search--error">
            Nothing found for ${input}
            </div>`
        }
}

// 검색창 내부 input 달라질 때마다 호출되는 함수
async function checkChatroomSearch(chatApp) {
    const chatSearchInput = document.querySelector(".chat__search input");
    if (chatSearchInput.value)
        showSearchResult(chatSearchInput.value);
    else
        await showChatList(chatApp);
    // 채팅방 정렬
}

export async function setChatPage(chatApp) {
    await showChatList(chatApp);

    const chatSearchBtn = document.querySelector(".chat__search");
    chatSearchBtn.onsubmit = function (e) {
        e.preventDefault();
    }
    chatSearchBtn.oninput = async () => {
        await checkChatroomSearch(chatApp);
    };
}