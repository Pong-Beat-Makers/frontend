import { routes } from "../route.js";

function getLastObj(chatId) {
    const valueAll = JSON.parse(localStorage.getItem(chatId));
    const lastObj = valueAll[valueAll.length - 1];
    return lastObj;
}

export function showChatList() {
    const chatRoomList = document.querySelector(".chat__room--list");
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i)
        if (key.startsWith("chatLog_")) {
            chatRoomList.innerHTML += routes["/chat"].chatRoomTemplate(
                key.slice(8),  // name : key에서 chatLog_ 뒤부터 끝까지
                getLastObj(key).msg, getLastObj(key).time);
        }
    }
}