import changeUrl from "../route.js";
import { socialLogin } from "../Login/loginUtils.js";
import { setChatPage } from "../Chat/chatPageUtils.js";
import { handleHomeModal } from "../Home/homeUtils.js";
import { handleGameModal } from "../Game/gameUtils.js";
import { setRankPage } from "../Rank/rankUtils.js";

export function handleLoginBtn() {
    const loginBtns = document.querySelectorAll(".login-btn");
    loginBtns[0].onclick = () => { socialLogin("google"); };
    loginBtns[1].onclick = () => { socialLogin("42intra"); };
}

function handleLogoutBtn(event) {
    localStorage.clear();
    deleteCookieAll();
    changeUrl("/login");
    handleLoginBtn();
}

export function handleNaviClick() {
    const headerElements = document.querySelectorAll(".main-section__list--item");
    const logoutBtn = document.querySelector(".header__logout--btn");
    headerElements[0].onclick = () => {
        changeUrl("/home");
        // handleHomeModal();
        headerElements[0].classList.add("active");
    };
    headerElements[1].onclick = () => {
        changeUrl("/chat");
        setChatPage();
        headerElements[1].classList.add("active");
    }
    headerElements[2].onclick = () => {
        changeUrl("/game");
        headerElements[2].classList.add("active");
        handleGameModal();
    }
    headerElements[3].onclick = () => {
        changeUrl("/rank");
        headerElements[3].classList.add("active");
        // handleRank();
        setRankPage();
        // handleFriendModalUtils();
    }
    logoutBtn.onclick = handleLogoutBtn;
}