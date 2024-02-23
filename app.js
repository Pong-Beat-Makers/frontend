import changeUrl from "./route.js";
import { handleChatModal, initChatSocket, handleSubmit } from "./Chat/chatUtils.js";
import { handleHomeModal } from "./Home/homeUtils.js";
import { updateProfile, resetProfile } from "./profileUtils.js";

import LoginSuccess from "./Login/loginSuccessTemplate.js";

const FRONTEND = "http://127.0.0.1:5001";
const BACKEND = "http://127.0.0.1:8000";

// http://127.0.0.1:5501/?code=4%2F0AeaYSHDHrOC_3acsM1JP9Wh3H3kFGTqSUZd3JYtMjlzk9GDC2r_oSu9LI2pZ4drZdROnEw&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&authuser=0&hd=g.skku.edu&prompt=consent
// => 127.0.0.1:8000/google/login/callback/?code=~~~ 로 GET 요청 보내기

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

// 로그인에서 메인화면으로 넘어가면서 handleModal() 등록되게 하기
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

// http://127.0.0.1:5501/?code=~~~
// => 127.0.0.1:8000/google/login/callback/?code=~~~ 로 GET 요청 보내기

if (window.location.search) {
    // console.log(window.location.search);
    fetch(`${BACKEND}/google/login/callback/?${window.location.search}`, {
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
        console.dir(data);
    });
    const body = document.querySelector(".body");
    body.innerHTML = LoginSuccess.template();
    window.addEventListener("click", handleClick);
    window.addEventListener("submit", handleSubmit);
    handleHomeModal();
    if (localStorage.length > 0) {
        updateProfile();
    }
    // window.location.search = ""; // 이거 추가하면 왜 .. 페이지 안바뀌지 ? ㅠㅠ
}