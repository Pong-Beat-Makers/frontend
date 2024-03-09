import { routes } from "../route.js";
import { showChatroom } from "./chatRoomUtils.js";

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
    const chatListTime = document.querySelectorAll(".chat__room--time");
    for (let i = 0; i < chatListTime.length; i++) {

    }
}

export function showChatList() {
    const chatRoomList = document.querySelector(".chat__room--list");
    chatRoomList.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith("chatLog_")) {
            chatRoomList.innerHTML += routes["/chat"].chatRoomTemplate(
                key.slice(8),  // name : key에서 chatLog_ 뒤부터 끝까지
                getLastObj(key).msg, getLastObj(key).time);
        }
    }
    if (chatRoomList.innerHTML === "")
        chatRoomList.innerHTML = `<div class="chat__search--error">
        You haven't started chatting!
        </div>`
}

function showSearchResult(input) {
    const chatRoomList = document.querySelector(".chat__room--list");
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
            Nothing found for ${input}
            </div>`
        }
}

// 검색창 내부 input 달라질 때마다 호출되는 함수
function checkChatroomSearch(event) {
    const chatSearchInput = document.querySelector(".chat__search input");
    if (chatSearchInput.value)
        showSearchResult(chatSearchInput.value);
    else
        showChatList();
    chatListOnclick();
    // 채팅방 정렬
}

export function setChatPage() {
    showChatList();
    chatListOnclick();

    const chatSearchBtn = document.querySelector(".chat__search");
    chatSearchBtn.onsubmit = function (e) {
        e.preventDefault();
    }
    chatSearchBtn.oninput = checkChatroomSearch;
}