import { routes } from "../route.js";
import { chatSocket, setFriendStatus } from "../Login/loginUtils.js";
import { showChatList, chatListOnclick } from "./chatPageUtils.js";
import Player from "../Login/player.js";
import { modalRender } from "../Profile/modalUtils.js";

function saveNewMsg(chatId, newMsgObj) {
    let chatLog = localStorage.getItem(chatId);
    if (chatLog) {
        chatLog = JSON.parse(chatLog);
    } else {
        chatLog = [];
    }
    chatLog.push(newMsgObj);
    localStorage.setItem(chatId, JSON.stringify(chatLog));
}

function updateChatLog(newMsgObj, fromNickname) {
    try {
        const chatNickname = document.querySelector(".chat__header--name");
        if (fromNickname !== Player._nickName && fromNickname !== chatNickname.innerText)
            throw new Error(`Not right room`);

        const chatFrame = document.querySelector(".chat__body--frame");
        chatFrame.innerHTML += routes["/chat"].chatBoxTemplate(
            `message_${newMsgObj.from}`, newMsgObj.msg, newMsgObj.time);
        newMsgObj.isRead = true;
        chatFrame.scrollTop = chatFrame.scrollHeight;
    }
    catch {
        // 채팅방 밖에 있는 경우 or 다른 채팅방에 있는 경우 알림띄움 !
        if (fromNickname === Player._nickName)
            return ;

            // TODO: 작동안됨
        Notification.requestPermission( function (result) {
            if (result === "denied")
                alert('알림이 차단된 상태입니다. 브라우저 설정에서 알림을 허용해주세요!');
        });

        // TODO: 알림 기능 체크, 아이콘 등록
        const noti = new Notification(fromNickname, {
            body: newMsgObj.msg,
            // icon: `/lib/img/novalogo_copy.png`,
        });
        setTimeout( function() { noti.close(); }, 3000);
        // modalRender('chatAlert', routes["/chat"].alertTemplate(data.from, data.message, data.time));
    }
}

function updateChatList() {
    try {
        showChatList();
        chatListOnclick();
    }
    catch {
        // 챗페이지 밖에 있을 경우 여기서 잡힘 => navi bar에 점 추가 후 누르면 점 없애기 ? ㅠㅠ ㅇㅇ
    }
}

function chatAlert() {
    const modal = document.querySelector('.modal');
    const modalContainer = document.createElement('div');

    modalContainer.classList.add('modal__container', `modal-name__chat-alert`);
    modalContainer.innerHTML = routes["/chat"].alertTemplate(data.from, data.message, data.time);

    modal.appendChild(modalContainer);

    const closeBtn = modalContainer.querySelector(".chat__alert--close");
    closeBtn.onclick = () => {
    }
}

export function initChatSocket() {
    chatSocket.onopen = function (e) {
        chatSocket.send(JSON.stringify({
            'token' : Player._token,
        }));
    };

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        // 첫 로그인 성공 시
        if (data.type === undefined) {
            initFriendsStatus(data.online_friends);
            return;
        } else if (data.type === 'send_status') { // 실시간 반영
            updateFriendStatus([data.from_id, data.from], data.status);
            return;
        }

        // 채팅
        const fromNickname = data.from;
        let chatSide;
        let chatId;
        if (fromNickname === Player._nickName) {
            chatSide = "me";
            chatId = document.querySelector(".chat__header--name").innerText;
        } else {
            chatSide = "you";
            chatId = fromNickname;
        }

        const newMsgObj = {
            from: chatSide,
            msg: data.message,
            time: data.time,
            isRead: false
        };
        updateChatLog(newMsgObj, fromNickname);
        saveNewMsg(`chatLog_${chatId}`, newMsgObj);
        updateChatList();
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
}

function initFriendsStatus(onlineFriendsList) {
    onlineFriendsList.forEach(element => {
        setFriendStatus(element, 'online');
    });
}

function updateFriendStatus(updatedFriend, status) {
    setFriendStatus(updatedFriend, status);
}
