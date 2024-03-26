import {showChatList, renderChatBox, CHATLOG_PREFIX} from "./chatPageUtils.js";
import {player} from "../app.js";

export function getOpponent(newMsgObj) {
    let opponent = undefined;
    if (newMsgObj !== undefined || (player.getId() === newMsgObj.from_id || player.getId() === newMsgObj.to_id)) {
        opponent = player.getId() === newMsgObj.from_id? newMsgObj.to_id : newMsgObj.from_id;
    }
    return opponent;
}

export function readChatLog(userId) {
    const localStorageLog = localStorage.getItem(CHATLOG_PREFIX + userId);
    let chatLog = localStorageLog ? JSON.parse(localStorageLog) : [];

    chatLog.forEach(log => log.isRead = true);

    localStorage.setItem(CHATLOG_PREFIX + userId, JSON.stringify((chatLog)));
}

export function saveNewMsg(newMsgObj) {
    /*
    * newMsgObj: {
    *   from_id: <int>,
    *   to_id: <int>,
    *   message: <string>,
    *   time: <string>,
    *   isRead: <boolean>
    * }
    * */

    let opponent = getOpponent(newMsgObj);
    if (opponent !== undefined) {
        const localStorageLog = localStorage.getItem(CHATLOG_PREFIX + opponent);
        let chatLog = localStorageLog ? JSON.parse(localStorageLog) : [];

        if (chatLog.length > 0) {
            chatLog.forEach(log => log.isRead = true);
        }
        chatLog.push(newMsgObj);

        localStorage.setItem(CHATLOG_PREFIX + opponent, JSON.stringify(chatLog));
    }
}

export async function processMessage(chatApp, app, messageData) {
    /*
    * messageData: {
    *   type: "chat_message",
    *   from: <string>,
    *   from_id: <int>,
    *   to_id: <int>,
    *   message: <string>,
    *   time: <string>
    * }
    * */
    const chatContainers = app.querySelectorAll('.chat__container');
    let isRender = false;

    chatContainers.forEach(container => {
        if (player.getId() === messageData.from_id || Number(container.id) === messageData.from_id) {
            // TODO: message render
            renderChatBox(container, messageData, true);
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