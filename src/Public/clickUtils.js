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

export function handleNaviClick(app) {
    const headerElements = app.querySelectorAll(".main-section__list--item");
    headerElements[0].onclick = () => {
        changeUrl("/home");
        // handleHomeModal();
    }
    headerElements[1].onclick = () => {
        changeUrl("/chat");
        setChatPage();
    }
    headerElements[2].onclick = () => {
        changeUrl("/game");
        handleGameModal();
    }
    headerElements[3].onclick = () => {
        changeUrl("/rank");
        setRankPage(app);
    }
    const logoutBtn = app.querySelector(".header__logout--btn");
    logoutBtn.onclick = handleLogoutBtn;
}