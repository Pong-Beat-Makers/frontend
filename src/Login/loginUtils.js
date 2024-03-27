import { USER_SERVER_DOMAIN, GAME_SERVER_DOMAIN, USER_MANAGEMENT_DOMAIN, GAME_API_DOMAIN, CHAT_WEBSOCKET } from "../Public/global.js"
import LoginSuccess from "./loginSuccessTemplate.js";
import Login from "./loginTemplate.js";
import ProfileModal from "../Profile/profileModalTemplate.js";
import player, {USER_STATUS} from "./player.js";
import changeUrl, {routes} from "../route.js";
import {handleLoginBtn, handleNaviClick} from "../Public/clickUtils.js";
import {
    friendModalClick,
    handleEditUserModalUtils,
    modalRender,
    setAvatar
} from "../Profile/modalUtils.js";
import Player from "./player.js";
import ChatApp from "../Chat/chatApp.js";

export const loginSuccessTemplate = LoginSuccess;
export const profileModalTemplate = ProfileModal;

export async function socialLogin(site) {
    const response = await fetch(`${USER_SERVER_DOMAIN}/${USER_MANAGEMENT_DOMAIN}/accounts/${site}/login/`, {
        method: 'GET',
    });
    if (!response.ok)
        throw new Error(`Error : ${response.status}`);

    const data = await response.json();
    window.location.href = data.login_url;
}

export function setFriendItem(chatApp, friendListElement, friendData, status = true) {
    /*
    * friendData : {
    *   id: <int>,
    *   nickname: <string>,
    *   profile: <string>
    * }
    * */
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('profile-section__friends--item');
    itemContainer.id = friendData.id;

    itemContainer.innerHTML = loginSuccessTemplate.friendBoxTemplate(friendData.nickname, status);
    const avatarNode = itemContainer.querySelector('.profile-section__friends--pic');

    setAvatar(friendData.profile, avatarNode);

    friendListElement.appendChild(itemContainer);

    itemContainer.addEventListener('click', async () => {
        await friendModalClick(friendData.id, chatApp);
    });
}

export async function setFriendList(chatApp) {
    // make friends elements
    const friendListElement = chatApp.getApp().querySelector(".profile-section__friends--list");
    try {
        const friendList = await Player.getFriendList();

        friendListElement.innerHTML = "";

        if (friendList.length > 0) {
            friendList.forEach(friendData => {
                setFriendItem(chatApp, friendListElement, friendData);
            });
        } else {
            friendListElement.innerHTML = `<div class="profile-section__friends--msg">
        Let's play the game
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        & make new friends 🤝</div>`;
        }
    } catch (e) {
        console.error(e.error);
        friendListElement.innerHTML = `<div class="profile-section__friends--msg">
        User Server is wrong 🥲 ..</div>`;
    }
}

async function handleProfileSearch(listNode, keyword, chatApp) {
    listNode.innerHTML = "";

    if (keyword === "") {
        return;
    }

    try {
        const data = await player.searchUser(keyword);

        data.forEach(user => {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('friend-item__container');
            itemContainer.style.width = '300px';
            itemContainer.style.marginBottom = '10px';

            setFriendItem(chatApp, itemContainer, user, false);

            listNode.appendChild(itemContainer);
        });
    } catch (e) {
        // TODO: error modal
    }
}

async function setProfileByNickname(divNode, nickname) {
    const data = await player.getUserDetail(nickname);
    console.log(data);
    // setAvatar(playerProfile, divNode);
}

async function setMatchHistory(modal, nickname) {
    const res = await fetch(`${GAME_SERVER_DOMAIN}/${GAME_API_DOMAIN}/game-data/history/?nickname=${nickname}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${Player._token}`,
        },
    });
    if (!res.ok)
        throw new Error(`Error : ${res.status}`);

    const data = await res.json()

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
    for (let i = 0; i < data.length; i++) {
        matchHistoryList.innerHTML += ProfileModal.matchHistoryTemplate();
    }

    const date = modal.querySelectorAll(".history-item__day");
    const myPic = modal.querySelectorAll(".match-my-avatar");
    const partnerPic = modal.querySelectorAll(".match-your-avatar");
    const score = modal.querySelectorAll(".history-item__score");
    const stat = modal.querySelectorAll(".history-item__status");
    for (let i = 0; i < data.length; i++) {
        const create_at =  new Date(data[i].created_at);
        date[i].innerHTML = `${create_at.getFullYear()}/${create_at.getMonth()}/${create_at.getDate()}`
        setProfileByNickname(myPic[i], data[i].user1_nickname);
        setProfileByNickname(partnerPic[i], data[i].user2_nickname);
        score[i].innerHTML = `Score ${data[i].user1_score} : ${data[i].user2_score}`;
        if (data[i].user1_score > data[i].user2_score)
            stat[i].innerHTML = "Win";
        else if (data[i].user1_score == data[i].user2_score)
            stat[i].innerHTML = "Draw";
        else
            stat[i].innerHTML = "Lose";
    }
}

export async function handleAddFriendBtn(chatApp) {
    const addFriendModal = modalRender('add-friend', profileModalTemplate.profileSearchTemplate())

    const profileSearchInput = addFriendModal.querySelector(".search-friend__body--input");
    const profileSearchList = addFriendModal.querySelector('.search-friend__body--list');
    profileSearchInput.onkeyup = async () => { await handleProfileSearch(profileSearchList, profileSearchInput.value, chatApp); };
}

export function changeTo2FAPage(loginUser) {
  const loginBody = document.querySelector(".login__container--body");

  loginBody.querySelector(".login__wrapper--header").innerHTML = "<span class='login__wrapper--header_'>Verification</span>";
  loginBody.querySelector(".login__wrapper--list").innerHTML = Login.twoFATempate();

  const codeInput = loginBody.querySelector('.login__body--input');
  const twoFABtn = loginBody.querySelector('.login__2fa-btn');

  codeInput.addEventListener('keyup', e => {
          twoFABtn.disabled = e.target.value.length !== 6;
          if (e.keyCode === 13) {
              twoFABtn.click();
          }
  });

  twoFABtn.addEventListener('click', async () => {
        const status = await loginUser.send2FACode(codeInput.value);
        const infoContainer = loginBody.querySelector('.login__body--info');

        infoContainer.innerHTML = "";
        try {
            location.reload();
        } catch (e) {
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

export async function renderMainPage(player) {
    const app = document.getElementById('app');

    if (player !== undefined && player.getStatus() === USER_STATUS.AUTHORIZED) {
        app.innerHTML = LoginSuccess.template();

        changeUrl("/home"); // TODO: location url check (window.location.pathname)
        app.querySelectorAll(".main-section__list--item")[0].classList.add("active");

        const chatApp = new ChatApp(app);

        setProfileSection(app, player);
        handleNaviClick(chatApp);
        await setFriendList(chatApp);

        const friendAddButton = app.querySelector(".profile-section__friends--button");
        friendAddButton.onclick = () => {
            handleAddFriendBtn(chatApp);
        };
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

    setAvatar(player.getProfile(), avatar);

    if (/User\d+$/.test(player.getNickName())) {
        infoNode[0].innerHTML = "We advise you to change your nickname!";
    } else {
        infoNode[0].innerHTML = "";
    }
    infoNode[1].children[0].innerHTML = player.getNickName();
    infoNode[2].innerHTML = player.getStatusMessage();

    handleEditUserModalUtils(app);
}
