import {BACKEND, LOCALHOST} from "../Public/global.js"
import LoginSuccess from "./loginSuccessTemplate.js";
import Login from "./loginTemplate.js";
import ProfileModal from "../Profile/profileModalTemplate.js";
import {USER_STATUS} from "./player.js";
import changeUrl from "../route.js";
import {initChatSocket} from "../Chat/chatSocketUtils.js";
import {handleLoginBtn, handleNaviClick} from "../Public/clickUtils.js";
import {handleEditUserModalUtils, handleFriendModalUtils} from "../Profile/modalUtils.js";
import {chatSocket} from "../app.js";

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

export function changeTo2FAPage(loginUser) {
  const loginBody = document.querySelector(".login__container--body");

  loginBody.querySelector(".login__wrapper--header").innerHTML = "<span class='login__wrapper--header_'>Verification</span>";
  loginBody.querySelector(".login__wrapper--list").innerHTML = Login.twoFATempate();

  const codeInput = loginBody.querySelector('.login__body--input');
  const twoFABtn = loginBody.querySelector('.login__2fa-btn');

  codeInput.addEventListener('keyup', e => {
          twoFABtn.disabled = e.target.value.length !== 6;
  });

  twoFABtn.addEventListener('click', async () => {
        const status = await loginUser.send2FACode(codeInput.value);
        const infoContainer = loginBody.querySelector('.login__body--info');

        infoContainer.innerHTML = "";
        if (status === 200) {
            location.reload();
        } else if (400 <= status < 500) {
            infoContainer.innerHTML = "Wrong code!";
        }
  });
}

export function getInfoJWT(token) {
    const base64Payload = token.split('.')[1];
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function renderMainPage(player) {
    const app = document.getElementById('app');

    if (player !== undefined && player.getStatus() === USER_STATUS.AUTHORIZED) {
        app.innerHTML = LoginSuccess.template();

        changeUrl("/home");
        app.querySelectorAll(".main-section__list--item")[0].classList.add("active");
        // handleHomeModal();
        handleNaviClick();
        setProfileSection(app, player);

        chatSocket = new WebSocket(
            'ws://' + LOCALHOST + ':8000' + '/ws/chatting/'
        );
        initChatSocket();
        setFriendList();

        const friendAddButton = document.querySelector(".profile-section__friends--button");
        friendAddButton.onclick = handleAddFriendBtn;
    } else {
        app.innerHTML = Login.template();
        handleLoginBtn();
        if (player !== undefined && player.getStatus() === USER_STATUS.NOT_AUTHORIZED) {
            changeTo2FAPage(player);
        }
    }
}

export function setProfileSection(app, player) {
    const profileSection = app.querySelector('.profile-section');

    const profile = profileSection.querySelector('.profile-section__profile');
    const avator = profile.querySelector('.profile-section__profile--avator');
    const infoNode = profile.querySelector('.profile-section__profile--info').children;

    avator.setAttribute('data-name', 'avator__image-cat');

    infoNode[0].innerHTML = player.getNickName();
    infoNode[1].innerHTML = player.getStatusMessage();

    // 메인 섹션 프로필 이벤트 등록
    handleEditUserModalUtils(app);
    handleFriendModalUtils(app);
}