import LoginSuccess from "./Login/loginSuccessTemplate.js";
import Login from "./Login/loginTemplate.js"
import changeUrl from "./route.js";
import { handleChatModal, initChatSocket, handleSubmit } from "./Chat/chatUtils.js";
import { handleHomeModal } from "./Home/homeUtils.js";
import { updateProfile, resetProfile } from "./profileUtils.js";
import { BACKEND } from "./Public/global.js"

function setUserInfo(site) {
    fetch(`${BACKEND}/accounts/${site}/login/`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok)
            throw new Error(`Error : ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.error)
            return ;
        window.location.href = data.login_url;
    });
}

function handleNaviClick() {
    const headerElements = document.querySelectorAll(".main-section__list--item");
    headerElements[0].onclick = () => {
        changeUrl("/home");
        handleHomeModal();
        headerElements[0].classList.add("active");
    };
    headerElements[1].onclick = () => {
		changeUrl("/chat");
        // handleChatModal();
        headerElements[1].classList.add("active");
        initChatSocket();
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

export default function handleClick(event)
{
    if (event.target.classList.contains("user-token-submit")) {
        localStorage.setItem("token", document.querySelector('#user-token-input').value);
        updateProfile();
    } else if (event.target.classList.contains("header__logout--btn")) {
        resetProfile();
        changeUrl("/login");
        loginBtns[0].onclick = () => {
            setUserInfo("google");
        };
        loginBtns[1].onclick = () => {
            setUserInfo("42intra");
        };
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

const app = document.querySelector("#app");
window.addEventListener("click", handleClick);
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
    handleHomeModal();
    if (localStorage.length > 0) {
        updateProfile();
    }
}
else {
    app.innerHTML = Login.template();
    const loginBtns = document.getElementsByClassName("login-btn");
    loginBtns[0].onclick = () => {
        setUserInfo("google");
    };
    loginBtns[1].onclick = () => {
        setUserInfo("42intra");
    };
}