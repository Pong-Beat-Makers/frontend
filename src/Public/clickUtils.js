import changeUrl from "../route.js";
import { socialLogin } from "../Login/loginUtils.js";
import { setChatPage } from "../Chat/chatPageUtils.js";
import { handleHomeModal } from "../Home/homeUtils.js";
import { handleGameModal } from "../Game/gameUtils.js";
import { setRankPage } from "../Rank/rankUtils.js";
import { deleteCookie } from "./cookieUtils.js";

export function handleLoginBtn() {
    const loginBtns = document.querySelectorAll(".login-btn");
    loginBtns[0].onclick = () => { socialLogin("google"); };
    loginBtns[1].onclick = () => { socialLogin("42intra"); };
}

function handleLogoutBtn(event) {
    localStorage.clear();
    deleteCookie('access_token');
    location.reload();
}

export function handleNaviClick(chatApp) {
    const headerElements = chatApp.getApp().querySelectorAll(".main-section__list--item");
    headerElements[0].onclick = () => {
        changeUrl("/home");
        // handleHomeModal();
    }
    headerElements[1].onclick = async () => {
        changeUrl("/chat");
        await setChatPage(chatApp);
    }
    headerElements[2].onclick = () => {
        changeUrl("/game");
        handleGameModal();
    }
    headerElements[3].onclick = async () => {
        changeUrl("/rank");
        await setRankPage(chatApp.getApp());
    }
    const logoutBtn = chatApp.getApp().querySelector(".header__logout--btn");
    logoutBtn.onclick = handleLogoutBtn;
}