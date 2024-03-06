import LoginSuccess from "./Login/loginSuccessTemplate.js";
import Login from "./Login/loginTemplate.js"
import changeUrl from "./route.js";
import { LOCALHOST } from "./Public/global.js";
import { initChatSocket } from "./Chat/chatSocketUtils.js";
import { moveRefresh, setFriendList } from "./Login/loginUtils.js";
import { handleLoginBtn, handleNaviClick } from "./Public/clickUtils.js";
import { handleHomeModal } from "./Home/homeUtils.js";
import { handleEditUserModalUtils, handleFriendModalUtils } from "./Modals/modalUtils.js";

const app = document.querySelector("#app");
export let chatSocket;

if (document.cookie) {
    moveRefresh();
    app.innerHTML = LoginSuccess.template();
    changeUrl("/home");
    document.querySelectorAll(".main-section__list--item")[0].classList.add("active");
    // handleHomeModal();
    
    chatSocket = new WebSocket(
        'ws://' + LOCALHOST + ':8000' + '/ws/chatting/'
    );
    initChatSocket();
    handleNaviClick();
    setFriendList();

    // 메인 섹션 프로필 이벤트 등록
    handleEditUserModalUtils();
    handleFriendModalUtils();
}
else {
    app.innerHTML = Login.template();
    handleLoginBtn();
}