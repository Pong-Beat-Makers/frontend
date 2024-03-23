import { routes } from "../route.js";
import { friendModalClick } from "../Profile/modalUtils.js";
import { USER_SERVER_DOMAIN, USER_MANAGEMENT_DOMAIN } from "../Public/global.js";
import Player from "../Login/player.js";
import { showProfileDetail } from "../Login/loginUtils.js";
import {modalRender} from "../Profile/modalUtils.js";
import ProfileModal from "../Profile/profileModalTemplate.js";

export async function setRankPage(app) {
    const res = await fetch(`${USER_SERVER_DOMAIN}/${USER_MANAGEMENT_DOMAIN}/profile/ranker/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${Player._token}`,
        },
    });
    if (!res.ok)
        throw new Error(`Error : ${res.status}`);

    const data = await res.json();
    const rankerNumber = data.length;
    const rankerStage = app.querySelector(".rank__stage");
    const rankerList = app.querySelector(".rank__list--friends");

/*
{{
"nickname": "User2",
"profile": ""
}, {
"nickname": "User2",
"profile": ""
}}
*/
    // TODO: rankerStage profile 등록 -> background image ! 
    if (rankerNumber >= 2)
        rankerStage.innerHTML += routes["/rank"].rankerStageTemplate("silver", data[1].nickname);
    if (rankerNumber >= 1)
        rankerStage.innerHTML += routes["/rank"].rankerStageTemplate("gold", data[0].nickname);
    if (rankerNumber >= 3) {
        rankerStage.innerHTML += routes["/rank"].rankerStageTemplate("bronze", data[2].nickname);

        for (let i = 4; i <= rankerNumber; i++) {
            rankerList.innerHTML += routes["/rank"].rankerTemplate(i, data[i].nickname);
        }
    }

    if (rankerStage.innerHTML === "")
        rankerStage.innerHTML = `<div class="chat__search--error">
        No ranker presents yet. Be the first ranker!
        </div>`
    await rankerOnclick(app.querySelector(".main-section__main"));
}

async function rankerOnclick(app) {
    const rankStage = app.querySelectorAll(".rank__stage--table");
    const stageName = app.querySelectorAll(".rank__stage--avatar");

    const rankerList = app.querySelectorAll(".profile-section__friends--item");
    const rankerName = app.querySelectorAll(".profile-section__friends--name");

    for (let i = 0; i < rankStage.length; i++) {
        rankStage[i].onclick = async () => {
            const detailProfileModal = modalRender('detailed-profile', ProfileModal.friendModalTemplate());
            await showProfileDetail(detailProfileModal, stageName[i].getAttribute('name'));
        };
    }

    for (let i = 0; i < rankerList.length; i++) {
        rankerList[i].onclick = async () => {
            const detailProfileModal = modalRender('detailed-profile', ProfileModal.friendModalTemplate());
            await showProfileDetail(detailProfileModal, rankerName[i]);            
        };
    }
}