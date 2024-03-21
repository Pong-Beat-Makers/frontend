import { BACKEND, USER_SERVER_DOMAIN, GAME_SERVER_DOMAIN, USER_MANAGEMENT_DOMAIN, GAME_API_DOMAIN, CHAT_WEBSOCKET } from "../Public/global.js"
import LoginSuccess from "./loginSuccessTemplate.js";
import Login from "./loginTemplate.js";
import ProfileModal from "../Profile/profileModalTemplate.js";
import {USER_STATUS} from "./player.js";
import changeUrl from "../route.js";
import {initChatSocket} from "../Chat/chatSocketUtils.js";
import {handleLoginBtn, handleNaviClick} from "../Public/clickUtils.js";
import {handleEditUserModalUtils, handleFriendModalUtils, modalRender} from "../Profile/modalUtils.js";
import Player from "./player.js";
import { showChatroom } from "../Chat/chatRoomUtils.js";

export async function socialLogin(site) {
    const response = await fetch(`${USER_SERVER_DOMAIN}/${USER_MANAGEMENT_DOMAIN}/accounts/${site}/login/`, {
        method: 'GET',
    });
    if (!response.ok)
        throw new Error(`Error : ${response.status}`);

    const data = await response.json();
    window.location.href = data.login_url;
}

export async function setFriendList(app) {
    // make friends elements
    const friendList = await Player.getFriendList();
    const friendListElement = app.querySelector(".profile-section__friends--list");
    friendListElement.innerHTML = "";
    for (let i = 0; i < friendList.length; i++) {
        friendListElement.innerHTML += LoginSuccess.friendBoxTemplate();
    }
    if (friendListElement.innerHTML === "") {
        friendListElement.innerHTML = `<div class="profile-section__friends--msg">
        Let's play the game
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        & make new friends 🤝</div>`;
        return ;
    }

    // TODO: add event listener !!
    const friendsAll = app.querySelectorAll(".profile-section__friends--item");
    const friendsName = app.querySelectorAll(".profile-section__friends--name");
    const frinedsPic = app.querySelectorAll(".profile-section__friends--pic");
    const friendsStat = app.querySelectorAll(".profile-section__friends--status");
    const friendsStatText = app.querySelectorAll(".profile-section__friends--status--text");
    let isOnline = 1; // TODO: online status update !!
    for (let i = 0; i < friendList.length; i++) {
        friendsAll[i].id = 'friends-list-' + friendList[i][0]; // user id 기준으로 id 지정
        friendsName[i].innerHTML = friendList[i][1]; // 닉네임 설정
        frinedsPic[i].innerHTML = ""; // TODO: update profile pic by friendList[i][1];
        if (isOnline === "online") {
            friendsStat[i].classList.add("online");
            friendsStatText[i].innerHTML = "online";
        } else {
            friendsStat[i].classList.add("offline");
            friendsStatText[i].innerHTML = "offline";
        }
        friendsAll[i].onclick = async () => {
            const detailProfileModal = modalRender('detailed-profile', ProfileModal.friendModalTemplate());
            await showProfileDetail(detailProfileModal, friendList[i][1]);
        }
    }
}

export async function setFriendStatus(friend, status) {
    // const app = document.querySelector(".profile-section__friends--list");
    let id = friend[0]
    let nickname = friend[1]
    const targetFriendItem = document.getElementById('friends-list-' + id);
    const targetFriendStatus = targetFriendItem.querySelector(".profile-section__friends--status");
    const targetFriendText = targetFriendItem.querySelector(".profile-section__friends--status--text");
    if (status === 'online') {
        targetFriendStatus.classList.replace("offline", status);
    } else if (status === 'offline') {
        targetFriendStatus.classList.replace("online", status);
    }
    let friendName = document.querySelector(`#friends-list-${id} .profile-section__friends--name`);
    friendName.innerHTML = nickname;

    targetFriendText.innerHTML = status;
}

async function handleProfileSearch(modal, input) {
    const profileSearchResult = modal.querySelector(".profile__result--list");
    profileSearchResult.innerHTML = "";
    if (input == "")
        return ;
    const res = await fetch(`${USER_SERVER_DOMAIN}/${USER_MANAGEMENT_DOMAIN}/profile/search/?keyword=${input}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${Player._token}`,
        },
    });
    if (!res.ok)
        throw new Error(`Error : ${res.status}`);

    const data = await res.json();
    for (let i = 0; i < data.length; i++) {
        //TODO: avatar 추가하기
        profileSearchResult.innerHTML += ProfileModal.profileSearchResultTemplate(data[i].nickname);
    }

    const profileItems = modal.querySelectorAll(".profile-section__friends--item");
    for (let i = 0; i < profileItems.length; i++) {
        profileItems[i].onclick = async () => {
            const detailProfileModal = modalRender('detailed-profile', ProfileModal.friendModalTemplate());
            await showProfileDetail(detailProfileModal, data[i].nickname);
        }
    }
}

async function showProfileDetail(modal, input) {
    const res = await fetch(`${USER_SERVER_DOMAIN}/${USER_MANAGEMENT_DOMAIN}/profile/?friend=${input}`, {
        method: 'GET',
        headers: {
            // TODO: getCookie로 토큰 불러온 부분 모두 수정 ;; => player에 함수 넣기 !
            'Authorization': `Bearer ${Player._token}`,
        },
    });
    if (!res.ok)
        throw new Error(`Error : ${response.status}`);

    const data = await res.json();

    // TODO: avatar 사용하는 부분 수정 필요 !
    const nickname = modal.querySelector(".friend-modal__info--nickname");
    // const avatar = modal.querySelector(".friend-modal__avatar");
    const status = modal.querySelector(".friend-modal__info--status");
    const rate = modal.querySelector(".friend-modal__game-info--rate span");
    const rank = modal.querySelector(".friend-modal__game-info--rank span");

    nickname.innerHTML = data.nickname;
    // avatar.classList.add(data.profile);
    status.innerHTML = data.status_message;
    let winRate = 0;
    if ((data.win + data.lose) != 0)
        winRate = data.win / (data.win + data.lose);
    rate.innerHTML = `${winRate * 100}%`
    rank.innerHTML = data.rank;

    await handleProfileBtns(modal, data);
    await setMatchHistory(modal, data.nickname);
}

async function handleProfileBtns (modal, obj) {
    const profileBtns = modal.querySelectorAll(".friend-modal__btn");
    // profileBtns[0] = chat, [1] = add

    profileBtns[0].onclick = () => {
        // TODO: move to chat page
        showChatroom(document.querySelector(".friend-modal__info--nickname").innerText);
    }

    let methodSelected;
    if (obj.is_friend == false) {
        profileBtns[1].innerHTML = `<i class="bi bi-person-plus"></i> add`;
        methodSelected = 'POST';
    } else {
        profileBtns[1].innerHTML = `<i class="bi bi-person-plus"></i> delete`;
        methodSelected = 'DELETE';
    }

    profileBtns[1].onclick = async () => {
        const data = {
                method: methodSelected,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Player._token}`,
                },
                body: JSON.stringify({
                    'friend' : obj.nickname,
                })
        };
        const res = await fetch(`${USER_SERVER_DOMAIN}/${USER_MANAGEMENT_DOMAIN}/friends/`, data);
        if (!res.ok)
            throw new Error(`Error : ${response.status}`);
        else if (methodSelected == 'POST')
            profileBtns[1].innerHTML = `<i class="bi bi-person-plus"></i> delete`;
        else if (methodSelected == 'DELETE')
            profileBtns[1].innerHTML = `<i class="bi bi-person-plus"></i> add`;
        await setFriendList(document.querySelector(".profile-section"));
    }
}

async function setMatchHistory(modal, nickname) {
    const res = await fetch(`${GAME_SERVER_DOMAIN}/${GAME_API_DOMAIN}/histroy/?nickname=${nickname}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${Player._token}`,
        },
    });
    if (!res.ok)
        throw new Error(`Error : ${res.status}`);

    const data = await res.json();
    const obj = JSON.parse(data);
    console.dir(obj);
/*
{
    "id": "< 게임 데이터 id>",
    // 유저 1이 자기 자신
    "user1_nickname": "<유저1 닉네임(게임 상 왼쪽에 있는 유저)>",
    "user2_nickname": "<유저2 닉네임(게임 상 오른쪽에 있는 유저)>",
    "user1_score": "<유저1 점수>",
    "user2_score": "<유저2 점수>",
    "match_type": "<랜덤인지 토너먼트인지 type>",
    "created_at": "<게임이 끝난 날짜와 시간>",
}
*/
    const matchHistoryList = modal.querySelector(".friend-modal__history-list");
    for (let i = 0; i < obj.length; i++) {
        matchHistoryList.innerHTML += ProfileModal.matchHistoryTemplate();
    }

    const date = modal.querySelectorAll(".history-item__day");
    const myPic = modal.querySelectorAll(".match-my-avatar");
    const partnerPic = modal.querySelectorAll(".match-your-avatar");
    const score = modal.querySelectorAll(".history-item__score");
    const stat = modal.querySelectorAll(".history-item__status");
    for (let i = 0; i < obj.length; i++) {
        date[i].innerHTML = obj[i].created_at; // TODO: 파싱 필요할지도
        myPic[i].innerHTML = "";
        partnerPic[i].innerHTML = ""; // TODO: 다시 fetch 해야 하는 거 아님 ? ㅠㅠ ..
        score[i].innerHTML = `Score ${obj[i].user1_score} : ${obj[i].user2_score}`;
        if (obj[i].user1_score > obj[i].user2_score)
            stat[i].innerHTML = "Win";
        else if (obj[i].user1_score == obj[i].user2_score)
            stat[i].innerHTML = "Draw";
        else
            stat[i].innerHTML = "Lose";
    }
}

export function handleAddFriendBtn() {
    const addFriendModal = modalRender('add-friend', ProfileModal.profileSearchTemplate())

    const profileSearchInput = addFriendModal.querySelector(".profile__search input");
    handleProfileSearch(addFriendModal, profileSearchInput.value);
    profileSearchInput.oninput = () => { handleProfileSearch(addFriendModal, profileSearchInput.value); };
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

export let chatSocket;

export function renderMainPage(player) {
    const app = document.getElementById('app');

    if (player !== undefined && player.getStatus() === USER_STATUS.AUTHORIZED) {
        app.innerHTML = LoginSuccess.template();

        changeUrl("/home");
        app.querySelectorAll(".main-section__list--item")[0].classList.add("active");
        // handleHomeModal();
        handleNaviClick();
        setProfileSection(app, player);
        setFriendList(app);

        const friendAddButton = app.querySelector(".profile-section__friends--button");
        friendAddButton.onclick = handleAddFriendBtn;

        chatSocket = new WebSocket(
            `${CHAT_WEBSOCKET}/ws/chatting/`
        );
        initChatSocket();
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
    const avatar = profile.querySelector('.profile-section__profile--avatar');
    const infoNode = profile.querySelector('.profile-section__profile--info').children;

    avatar.setAttribute('data-name', 'avatar__image-cat');

    infoNode[0].innerHTML = player.getNickName();
    infoNode[1].innerHTML = player.getStatusMessage();

    handleEditUserModalUtils(app);
    handleFriendModalUtils(app);
}
