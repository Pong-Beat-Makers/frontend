import { routes } from "../route.js";
import { setFriendStatus } from "../Login/loginUtils.js";
import {showChatList, chatListOnclick, renderChatBox, CHATLOG_PREFIX} from "./chatPageUtils.js";
import Player from "../Login/player.js";
import {player} from "../app.js";

export function saveNewMsg(newMsgObj) {
    /*
    * newMsgObj: {
    *   from: <string>,
    *   from_id: <int>,
    *   message: <string>,
    *   time: <string>,
    *   isRead: <boolean>
    * }
    * */
    if (newMsgObj !== undefined && player.getId() !== newMsgObj.from_id) {
        const localStorageLog = localStorage.getItem(CHATLOG_PREFIX + newMsgObj.from_id);
        let chatLog = localStorageLog ? JSON.parse(localStorageLog) : [];

        if (chatLog.length > 0) {
            // TODO: 저장 기준 다시 생각해봐야함 ..
            chatLog.forEach(log => log.isRead = true);
            const lastDate = new Date('2000-01-01T' + chatLog[chatLog.length - 1].time + ':00');
            const currDate = new Date('2000-01-01T' + newMsgObj.time + ':00');

            if (lastDate < currDate) {
                chatLog.push(newMsgObj);
            }
        } else {
            chatLog.push(newMsgObj);
        }

        localStorage.setItem(CHATLOG_PREFIX + newMsgObj.from_id, JSON.stringify(chatLog));
    }
}

async function updateChatLog(newMsgObj, fromNickname) {
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

        await Notification.requestPermission(function (result) {
            if (result === "denied")
                alert('알림이 차단된 상태입니다. 브라우저 설정에서 알림을 허용해주세요!');
        });

        // TODO: 알림 기능 체크, 아이콘 등록
        const noti = new Notification(fromNickname, {
            body: newMsgObj.msg,
            // icon: `/lib/img/novalogo_copy.png`,
        });
        setTimeout( function() { noti.close(); }, 3000);
    }
}

function updateChatList() {
    try {
        showChatList();
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

export async function initChatSocket() {
    chatSocket.onopen = function (e) {
        chatSocket.send(JSON.stringify({
            'token' : Player._token,
        }));
    };

    chatSocket.onmessage = async function(e) {
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
        await updateChatLog(newMsgObj, fromNickname);
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

export async function processMessage(chatApp, app, messageData) {
    /*
    * messageData: {
    *   type: "chat_message",
    *   from: <string>,
    *   from_id: <int>,
    *   message: <string>,
    *   time: <string>
    * }
    * */
    const chatContainers = app.querySelectorAll('.chat__container');
    let isRender = false;

    chatContainers.forEach(container => {
        if (player.getId() === messageData.from_id || Number(container.id) === messageData.from_id) {
            // TODO: message render
            renderChatBox(container, messageData);
            isRender = true;
        }
    });
    if (!isRender) {
        // TODO: message alert
        await Notification.requestPermission(function (result) {
            if (result === "denied")
                alert('알림이 차단된 상태입니다. 브라우저 설정에서 알림을 허용해주세요!');
        });

        messageData.isRead = false;
        saveNewMsg(messageData);
        await showChatList(chatApp);

        // TODO: 알림 기능 체크, 아이콘 등록
        const noti = new Notification(messageData.from, {
            body: messageData.message,
            // icon: `/lib/img/novalogo_copy.png`,
        });
        setTimeout( function() { noti.close(); }, 3000);
    }
}