import LoginSuccess from "./Login/loginSuccessTemplate.js";
import changeUrl from "./route.js";
import { handleChatModal, initChatSocket, handleSubmit } from "./Chat/chatUtils.js";
import { handleHomeModal } from "./Home/homeUtils.js";
import { updateProfile, resetProfile } from "./profileUtils.js";
import { BACKEND } from "../Public/global.js"

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

const loginBtns = document.getElementsByClassName("login_box");
loginBtns[0].onclick = () => {
    setUserInfo("google");
};
loginBtns[1].onclick = () => {
    setUserInfo("42intra");
};

export default function handleClick(event)
{
    if (event.target.classList.contains("homeBtn")) {
        changeUrl("/home");
        handleHomeModal();
	} else if (event.target.classList.contains("chatBtn")) {
		changeUrl("/chat");
        handleChatModal();
        initChatSocket();
	} else if (event.target.classList.contains("gameBtn")) {
        changeUrl("/game");
        // handleGame();
    } else if (event.target.classList.contains("rankBtn")) {
        changeUrl("/rank");
        // handleRank();
    } else if (event.target.classList.contains("user-token-submit")) {
        localStorage.setItem("token", document.querySelector('#user-token-input').value);
        updateProfile();
    } else if (event.target.classList.contains("logoutBtn")) {
        resetProfile();
        changeUrl("/login");
        loginBtns[0].onclick = () => {
            window.location.href = `${BACKEND}/accounts/google/login/`;
        };
        loginBtns[1].onclick = () => {
            window.location.href = `${BACKEND}/accounts/google/login/`;
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

if (document.cookie) {
    if (getCookie("refresh_token")) {
        const cookies = Object.fromEntries(
            document.cookie.split(';').map((cookie) => cookie.trim().split('=')),
        );
        localStorage.setItem("refresh_token", cookies["refresh_token"]);
        deleteCookie("refresh_token");
    }
    const body = document.querySelector(".body");
    body.innerHTML = LoginSuccess.template();
    window.addEventListener("click", handleClick);
    window.addEventListener("submit", handleSubmit);
    handleHomeModal();
    if (localStorage.length > 0) {
        updateProfile();
    }
}