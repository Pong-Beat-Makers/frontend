import LoginSuccess from "./Login/loginSuccessTemplate.js";
import Login from "./Login/loginTemplate.js"
import changeUrl from "./route.js";
import { handleChatModal, initChatSocket, handleSubmit } from "./Chat/chatUtils.js";
import { handleHomeModal } from "./Home/homeUtils.js";
import { resetProfile } from "./profileUtils.js";
import { setUserInfo, getCookie, deleteCookie } from "./Login/loginUtils.js";

function handleNaviClick() {
    const headerElements = document.querySelectorAll(".main-section__list--item");
    headerElements[0].onclick = () => {
        changeUrl("/home");
        handleHomeModal();
        headerElements[0].classList.add("active");
    };
    headerElements[1].onclick = () => {
		changeUrl("/chat");
        handleChatModal();
        initChatSocket();
        headerElements[1].classList.add("active");
        // handleChatSocket(); // handle chat modal 내부에 있음
    }
    headerElements[2].onclick = () => {
        changeUrl("/game");
        headerElements[2].classList.add("active");
        // handleGame();
    }
    headerElements[3].onclick = () => {
        changeUrl("/rank");
        headerElements[3].classList.add("active");
        // handleRank();
    }
}

function handleLogoutBtn(event) {
    resetProfile();
    changeUrl("/login");
    const loginBtns = document.getElementsByClassName("login-btn");
    loginBtns[0].onclick = () => { setUserInfo("google"); };
    loginBtns[1].onclick = () => { setUserInfo("42intra"); };
}

const app = document.querySelector("#app");
window.addEventListener("submit", handleSubmit);

if (document.cookie) {
    if (getCookie("refresh_token")) {
        const cookies = Object.fromEntries(
            document.cookie.split(';').map((cookie) => cookie.trim().split('=')),
        );
        localStorage.setItem("refresh_token", cookies["refresh_token"]);
        deleteCookie("refresh_token");
    }
    app.innerHTML = LoginSuccess.template();
    changeUrl("/home");
    handleNaviClick();
    document.querySelectorAll(".main-section__list--item")[0].classList.add("active");
    document.querySelector(".header__logout--btn").onclick = handleLogoutBtn;
    // handleHomeModal();
}
else {
    app.innerHTML = Login.template();
    const loginBtns = document.getElementsByClassName("login-btn");
    loginBtns[0].onclick = () => { setUserInfo("google"); };
    loginBtns[1].onclick = () => { setUserInfo("42intra"); };
}