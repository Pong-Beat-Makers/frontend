import {friendModalClick, setAvatar} from "../Profile/modalUtils.js";
import {player} from "../app.js";
import {setFriendItem} from "../Login/loginUtils.js";

function getStageProfile(tier, data, chatApp) {
    const tableNode = document.createElement('div');
    const profileNode = document.createElement('div');

    tableNode.classList.add('rank__stage--table');
    profileNode.classList.add('rank__stage--avatar', `rank__profile--${tier}`);

    setAvatar(data.profile, profileNode);

    profileNode.addEventListener('click', async () => {
        await friendModalClick(data.id, chatApp);
    });

    tableNode.appendChild(profileNode);
    return tableNode;
}

function getRankerItem(rank, data, app) {
    const item = document.createElement('div');
    const rankNode = document.createElement('div');

    item.classList.add('rank__list--item');
    rankNode.classList.add('rank__list--number');

    rankNode.innerHTML = rank;

    item.appendChild(rankNode);
    setFriendItem(app, item, data, false);
    return item;
}

export async function setRankPage(app) {
    try {
        const data = await player.getRankerList();
        /*
        * rankerList: [{
        *   id: <int>,
        *   nickname: <string>,
        *   profile: <string>
        * }]
        * */
        console.log(data)
        const rankerNumber = data.length;
        const rankerStage = app.querySelector(".rank__stage");
        const rankerList = app.querySelector(".rank__list--friends");

        if (rankerNumber >= 2)
            rankerStage.appendChild(getStageProfile('silver', data[1], app));
        if (rankerNumber >= 1)
            rankerStage.appendChild(getStageProfile('gold', data[0], app));
        if (rankerNumber >= 3) {
            rankerStage.appendChild(getStageProfile('bronze', data[2], app));

            for (let i = 3; i < rankerNumber; ++i) {
                rankerList.appendChild(getRankerItem(i, data[i], app));
            }
        }

        if (rankerStage.innerHTML === "")
            rankerStage.innerHTML = `<div class="chat__search--error">
        No ranker presents yet. Be the first ranker!
        </div>`
    } catch (e) {
        // TODO: error modal
    }
}

async function rankerOnclick(app) {
    const rankStage = app.querySelectorAll(".rank__stage--table");
    const stageName = app.querySelectorAll(".rank__stage--avatar");

    const rankerList = app.querySelectorAll(".profile-section__friends--item");
    const rankerName = app.querySelectorAll(".profile-section__friends--name");

    for (let i = 0; i < rankStage.length; i++) {
        rankStage[i].onclick = async () => {
            // const detailProfileModal = modalRender('detailed-profile', ProfileModal.friendModalTemplate());
            // await showProfileDetail(detailProfileModal, stageName[i].getAttribute('name'));
            await friendModalClick(stageName[i].getAttribute('name'));
        };
    }

    for (let i = 0; i < rankerList.length; i++) {
        rankerList[i].onclick = async () => {
            // const detailProfileModal = modalRender('detailed-profile', ProfileModal.friendModalTemplate());
            // await showProfileDetail(detailProfileModal, rankerName[i]);
            await friendModalClick(rankerName[i]);
        };
    }
}