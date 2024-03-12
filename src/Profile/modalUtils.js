import ProfileModal from "./profileModalTemplate.js";

export function  modalRender(modalName, htmlCode) {
    const modal = document.querySelector('.modal');
    modal.innerHTML += htmlCode;

    document.querySelector('.modal__background').addEventListener('click', () => {
        const modalContainer = document.querySelector(`.modal-name__${modalName}`);
        if (modalContainer !== undefined)  modalContainer.remove();
    });
}

export function friendModalClick() {
    modalRender("friend-profile", ProfileModal.friendModalTemplate());
    const nickname = document.querySelector(".profile-section__friends--name").innerHTML;
    showProfileDetail(nickname);
}

export function showProfileDetail(input) {
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
        console.dir(obj);
        // obj.nickname, obj.profile, obj.status_message, obj.win, obj.lose, obj.rank, obj.is_friend
        
        const nicknameInModal = document.querySelector(".friend-modal__info--nickname");
        const status = document.querySelector(".friend-modal__info--status");
        const rate = document.querySelector(".friend-modal__game-info--rate");
        const rank = document.querySelector(".friend-modal__game-info--rank");
        const isFriend = document.querySelector(".friend-modal__btn");

        nicknameInModal.innerHTML = nickname;
        status.innerHTML = obj.status_message;
        rate.innerHTML = `${(obj.win / (obj.win + obj.lose)) * 100}%`
        rank.innerHTML = obj.rank;
        if (obj.is_friend == false)
            isFriend.innerHTML = `<i class="bi bi-person-plus"></i> add`;
        else
            isFriend.innerHTML = `<i class="bi bi-person-plus"></i> delete`;

        setMatchHistory(nickname);
    });
}

function setMatchHistory(nickname) {
    const matchHistoryList = document.querySelector(".friend-modal__history-list");
    fetch(`${BACKEND}/api/game/histroy/?nickname=${nickname}`, {
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
        const obj = JSON.parse(data);
        console.dir(obj);
        /*
        {
        "id": "< 게임 데이터 id>",
        "user1_nickname": "<유저1 닉네임(게임 상 왼쪽에 있는 유저)>",
        "user2_nickname": "<유저2 닉네임(게임 상 오른쪽에 있는 유저)>",
        "user1_score": "<유저1 점수>",
        "user2_score": "<유저2 점수>",
        "match_type": "<랜덤인지 토너먼트인지 type>",
        "created_at": "<게임이 끝난 날짜와 시간>",
        }
        */
        // 유저 1이 자기 자신
        for (let i = 0; i < obj.length; i++) {
            matchHistoryList.innerHTML += ProfileModal.matchHistoryTemplate();
        }
        const date = document.querySelectorAll(".history-item__day");
        const myPic = document.querySelectorAll(".match-my-avator");
        const partnerPic = document.querySelectorAll(".match-your-avator");
        const score = document.querySelectorAll(".history-item__score");
        const stat = document.querySelectorAll(".history-item__status");
        for (let i = 0; i < obj.length; i++) {
            date[i].innerHTML = obj[i].created_at; // 파싱 필요할지도
            myPic[i].innerHTML = "";
            partnerPic[i].innerHTML = ""; // 다시 fetch 해야 하는 거 아님 ? ㅠㅠ ..
            score[i].innerHTML = `Score ${obj[i].user1_score} : ${obj[i].user2_score}`;
            if (obj[i].user1_score > obj[i].user2_score)
                stat[i].innerHTML = "Win";
            else if (obj[i].user1_score == obj[i].user2_score)
                stat[i].innerHTML = "Draw";
            else
                stat[i].innerHTML = "Lose";
        }
    });
}

export function handleEditUserModalUtils() {
    const profileBtn = document.querySelector('.profile-section__profile');

    profileBtn.addEventListener('click', () => {
        modalRender("profile", ProfileModal.template());

        document.querySelectorAll('textarea').forEach(element => {
            element.addEventListener('keyup', e => {
                const textLenLimit = e.target.nextElementSibling.firstElementChild;
                textLenLimit.innerHTML = `${e.target.value.length}`;
            });
        });

        document.querySelectorAll('.profile-modal__avatorlist > .profile-modal__avator').forEach(element => {
            element.addEventListener('click', e => {
                e.target.classList.forEach(c => {
                    if (c.startsWith('image_')) {
                        document.querySelector('.profile-modal__big-avator').classList.remove()
                    }
                });
            });
        });
    })
}

export function handleFriendModalUtils() {
    const frendItems = document.querySelectorAll('.profile-section__friends--item');

    frendItems.forEach(item => {
        item.removeEventListener('click', friendModalClick, true);
        item.addEventListener('click', friendModalClick);
    });
}