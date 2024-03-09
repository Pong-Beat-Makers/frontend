import { BACKEND } from "../Public/global.js"
import LoginSuccess from "./loginSuccessTemplate.js";
import ProfileModal from "../Profile/profileModalTemplate.js";

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
        });
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

export function deleteCookieAll () {
    const cookies = document.cookie.split('; ');
    const expiration = 'Sat, 01 Jan 1972 00:00:00 GMT';

    for (i = 0; i < cookies.length; i++) {
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
        // console.dir(data);
        // const obj = JSON.parse(data);
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
        // 각 element에 eventlistener 달아서 클릭시 세부정보 모달 띄우도록 하기
    });
}

export function handleAddFriendBtn() {
    const modal = document.querySelector(".modal");
    modal.innerHTML = ProfileModal.profileSearchTemplate();

    const profileSearchInput = document.querySelector(".profile__search input");
    handleProfileSearch(profileSearchInput.value);
    profileSearchInput.oninput = () => { handleProfileSearch(profileSearchInput.value); };

    document.querySelector('.modal__background').addEventListener('click', () => {
        const modalContainer = document.querySelector('.modal-name__friend-profile');
        if (modalContainer !== undefined)  modalContainer.remove();
    });
}