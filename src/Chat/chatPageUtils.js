import { routes } from "../route.js";
import { showChatroom } from "./chatRoomUtils.js";
import {player} from "../app.js";
import {setAvatar} from "../Profile/modalUtils.js";
import {saveNewMsg} from "./chatSocketUtils.js";

export const CHATLOG_PREFIX = 'chatLog_';

function getLastObj(chatId) {
    const valueAll = JSON.parse(localStorage.getItem(chatId));
    const lastObj = valueAll[valueAll.length - 1];
    return lastObj;
}

export function chatListOnclick() {
    const openModalBtn = document.querySelectorAll(".chat__room");
    for (let i = 0; i < openModalBtn.length; i++) {
        openModalBtn[i].onclick = function() {
            showChatroom(openModalBtn[i].querySelector(".chat__room--name").innerText);
        }
    }
}

function sortChatList() {
    const chatRoomAll = document.querySelectorAll(".chat__room");
    const chatListTime = document.querySelectorAll(".chat__room--time");
    for (let i = 0; i < chatListTime.length; i++) {
        chatRoomAll[i]
    }
}

export function renderChatBox(chatContainer, newMsgObj, chatApp) {
    /*
    * newMsgObj: {
    *   from: <string>,
    *   from_id: <int>,
    *   message: <string>,
    *   time: <string>,
    *   isRead: <boolean>
    * }
    * */
    const frameNode = chatContainer.querySelector('.chat__body--frame');

    frameNode.innerHTML += routes["/chat"].chatBoxTemplate(
        `message_${player.getId() === newMsgObj.from_id? 'me':'you'}`, newMsgObj.message, newMsgObj.time);
    newMsgObj.isRead = true;
    frameNode.scrollTop = frameNode.scrollHeight;
    saveNewMsg(newMsgObj);
}

export async function renderChatRoom(chatRoomList, lastObj, chatApp) {

    if (lastObj.from === undefined) {
        return ;
    }

    try {
        const userDetail = await player.getUserDetail(lastObj.from_id);

        const chatRoomItem = document.createElement('div');
        chatRoomItem.classList.add('chat__room');

        chatRoomItem.innerHTML = routes['/chat'].chatRoomTemplate(userDetail.nickname, lastObj.message, lastObj.time);

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
            let key = localStorage.key(i);
            if (key.startsWith("chatLog_")) {
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