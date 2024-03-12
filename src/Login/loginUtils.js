import { BACKEND } from "../Public/global.js"
import LoginSuccess from "./loginSuccessTemplate.js";
import ProfileModal from "../Profile/profileModalTemplate.js";
import { modalRender, showProfileDetail } from "../Profile/modalUtils.js";
import { routes } from "../route.js";

export function socialLogin(site) {
    fetch(`${BACKEND}/api/user-management/accounts/${site}/login/`, {
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
        // 아래부터 콜백 url 받고 실행되게 해야 함 ;; !! 수정하기
        modalRender("2FA", routes["/login"].modalTemplate());
        const TFAForm = document.querySelector(".login__2FA");
        TFAForm.onsubmit = (e) => {
            e.preventDefault();
            handle2FAInput(TFAForm.input.value);
        }
    });
}

function handle2FAInput(input) {
    fetch(`${BACKEND}/api/user-management/accounts/email_verification/?2FAcode=${input}`, {
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
        console.log("login success!");
    });
}

export function getCookie(cname) {
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

export function deleteCookieAll () {
    const cookies = document.cookie.split('; ');
    const expiration = 'Sat, 01 Jan 1972 00:00:00 GMT';

    for (let i = 0; i < cookies.length; i++) {
        document.cookie = cookies[i].split('=')[0] + '=; expires=' + expiration;
    }
}
/*
function moveRefresh() {
    if (getCookie("refresh_token")) {
        const cookies = Object.fromEntries(
            document.cookie.split(';').map((cookie) => cookie.trim().split('=')),
        );
        localStorage.setItem("refresh_token", cookies["refresh_token"]);
        deleteCookie("refresh_token");
    }
}
*/
export function setFriendList() {
    let friendsArray = [];

    // for (let i = 0; i < 5; i++) {
    //     friendsArray.push([`100${i}`, "default"]);
    // }

    fetch(`${BACKEND}/api/user-management/friends/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${(getCookie("access_token"))}`,
        },
    })
    .then(response => {
        if (!response.ok)
            throw new Error(`Error : ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (!data)
            return ;
        for (let i = 0; i < data.length; i++) {
            friendsArray.push([data[i].nickname, data[i].profile]);
        }
    });

    const FriendsNum = friendsArray.length;
    const friendList = document.querySelector(".profile-section__friends--list");
    for (let i = 0; i < FriendsNum; i++) {
        friendList.innerHTML += LoginSuccess.friendBoxTemplate();
    }
    if (friendList.innerHTML === "") {
        friendList.innerHTML += `<div class="profile-section__friends--msg">
        Let's play the game
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        & make new friends 🤝</div>`;
        return ;
    }

    const friendsName = document.querySelectorAll(".profile-section__friends--name");
    const frinedsPic = document.querySelectorAll(".profile-section__friends--pic");
    const friendsStat = document.querySelectorAll(".profile-section__friends--status");
    const friendsStatText = document.querySelectorAll(".profile-section__friends--status--text");
    let isOnline = 1; // fetch;
    for (let i = 0; i < FriendsNum; i++) {
        friendsName[i].innerHTML = friendsArray[i][0];
        frinedsPic[i].innerHTML = ""; // friendsArray[i][1];
        if (isOnline === "online") {
            friendsStat[i].classList.add("online");
            friendsStatText[i].innerHTML = "online";
        } else if (isOnline === "playing") {
            friendsStat[i].classList.add("playing");
            friendsStatText[i].innerHTML = "in game";
        } else {
            friendsStat[i].classList.add("offline");
            friendsStatText[i].innerHTML = "offline";
        }
    }
}

function handleProfileSearch(input) {
    const profileSearchResult = document.querySelector(".profile__result--list");
    profileSearchResult.innerHTML = "";
    if (input == "")
        return ;
    fetch(`${BACKEND}/api/user-management/profile/search/?keyword=${input}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${(getCookie("access_token"))}`,
        },
    })
    .then(response => {
        if (!response.ok)
            throw new Error(`Error : ${response.status}`);
        return response.json();
    })
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            profileSearchResult.innerHTML += ProfileModal.profileSearchResultTemplate(data[i]);
        }
        const profileItems = document.querySelectorAll(".profile-section__friends--item");
        for (let i = 0; i < profileItems.length; i++) {
            profileItems[i].onclick = () => {
                const modal = document.querySelector(".modal_double");
                modal.innerHTML += ProfileModal.friendModalTemplate();
                showProfileDetail(data[i]);
            }
        }
    });
}

export function handleAddFriendBtn() {
    modalRender("profile-search", ProfileModal.profileSearchTemplate());

    const profileSearchInput = document.querySelector(".profile__search input");
    handleProfileSearch(profileSearchInput.value);
    profileSearchInput.oninput = () => { handleProfileSearch(profileSearchInput.value); };
}