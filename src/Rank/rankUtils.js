import { routes } from "../route.js";
import { friendModalClick } from "../Modals/modalUtils.js";

export function setRankPage() {
    const RankerNumber = 18; // 추후 백엔드에서 불러오기
    const rankerStage = document.querySelector(".rank__stage");
    const rankerList = document.querySelector(".rank__list--friends");

    if (1) // 2등이 있다면
        rankerStage.innerHTML += routes["/rank"].rankerStageTemplate("silver");
    if (1) // 1등이 있다면
        rankerStage.innerHTML += routes["/rank"].rankerStageTemplate("gold");
    if (1) { // 3등이 있다면
        rankerStage.innerHTML += routes["/rank"].rankerStageTemplate("bronze");

        for (let i = 0; i < RankerNumber; i++) {
            rankerList.innerHTML += routes["/rank"].rankerTemplate();
        }

        const rankerNum = document.querySelectorAll(".rank__list--number");
        for (let i = 0; i < RankerNumber; i++) {
            rankerNum[i].innerHTML = i + 4;
        }    
    }

    if (rankerStage.innerHTML === "")
        rankerStage.innerHTML = `<div class="chat__search--error">
        No ranker presents yet. Be the first ranker!
        </div>`
    rankerOnclick();
}

function rankerOnclick() {
    const rankStage = document.querySelectorAll(".rank__stage--table");
    const rankerList = document.querySelectorAll('.profile-section__friends--item');

    rankStage.forEach(item => {
        item.removeEventListener('click', friendModalClick, true);
        item.addEventListener('click', friendModalClick);
    })

    rankerList.forEach(item => {
        item.removeEventListener('click', friendModalClick, true);
        item.addEventListener('click', friendModalClick);
    });
}