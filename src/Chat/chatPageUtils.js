import { routes } from "../route.js";

function getLastObj(chatId) {
    const valueAll = JSON.parse(localStorage.getItem(chatId));
    const lastObj = valueAll[valueAll.length - 1];
    return lastObj;
}

export function showChatList() {
    const chatRoomList = document.querySelector(".chat__room--list");
    chatRoomList.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i)
        if (key.startsWith("chatLog_")) {
            chatRoomList.innerHTML += routes["/chat"].chatRoomTemplate(
                key.slice(8),  // name : key에서 chatLog_ 뒤부터 끝까지
                getLastObj(key).msg, getLastObj(key).time);
        }
    }
}

export function showSearchResult(input) {
    const chatRoomList = document.querySelector(".chat__room--list");
    const chatSearchInput = document.querySelector(".chat__search input");
    chatRoomList.innerHTML = "";
    let isFound = false;
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        // localStorage key 중 input을 포함하는 chatLog가 있다면,
        if (key.includes(input) && key.startsWith("chatLog_")) {
            isFound = true;
            chatRoomList.innerHTML += routes["/chat"].chatRoomTemplate(
                key.slice(8),  // name : key에서 chatLog_ 뒤부터 끝까지
                getLastObj(key).msg, getLastObj(key).time);
        }
    }
    if (isFound === false) {
        chatRoomList.innerHTML = `<div class="chat__search--error">
        Nothing found for ${chatSearchInput.value}
        </div>`
    }
}