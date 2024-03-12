import { BACKEND } from "../Public/global.js"
import LoginSuccess from "./loginSuccessTemplate.js";
import ProfileModal from "../Profile/profileModalTemplate.js";
import { modalRender } from "../Profile/modalUtils.js";

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
                showProfileDetail(data[i]);
            }
        }
    });
}

function showProfileDetail(input) {
    fetch(`${BACKEND}/api/user-management/profile/?friend=${input}`, {
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
        // {"nickname":"user1","profile":"default","status_message":"Hello","win":1,"lose":1,"rank":4,"is_friend":False}
        const obj = JSON.parse(data);
        // obj.nickname, obj.profile, obj.status_message, obj.win, obj.lose, obj.rank, obj.is_friend
        console.dir(obj);
        // modalRender("friend-profile", ProfileModal.profileSearchTemplate());
        // profileSearchResult.innerHTML += ProfileModal.profileSearchResultTemplate(data[i]);
    });
}

export function handleAddFriendBtn() {
    modalRender("friend-profile", ProfileModal.profileSearchTemplate());

    const profileSearchInput = document.querySelector(".profile__search input");
    handleProfileSearch(profileSearchInput.value);
    profileSearchInput.oninput = () => { handleProfileSearch(profileSearchInput.value); };
}