import { routes } from "../route.js";
import { friendModalClick } from "../Modals/modalUtils.js";

const RankerNumber = 18;
// 추후 백엔드에서 불러오기

export function setRankPage() {
// 1등 띄우기
// 2등 띄우기
// 3등 띄우기

    const rankerList = document.querySelector(".rank__list--friends");
    for (let i = 0; i < RankerNumber; i++) {
        rankerList.innerHTML += routes["/rank"].rankerTemplate();
    }

    const rankerNum = document.querySelectorAll(".rank__list--number");
    for (let i = 0; i < RankerNumber; i++) {
        rankerNum[i].innerHTML = i + 4;
    }

    // if (rankerList.innerHTML === "")
        rankerList.innerHTML = `<div class="chat__search--error">
        No ranker presents yet. Be the first ranker!
        </div>`
    rankerOnclick();
}

function rankerOnclick() {
    const rankersHigh = document.querySelectorAll(".rank__stage--table");
    const rankers = document.querySelectorAll('.profile-section__friends--item');

    rankersHigh.forEach(item => {
        item.removeEventListener('click', friendModalClick, true);
        item.addEventListener('click', friendModalClick);
    })

    rankers.forEach(item => {
        item.removeEventListener('click', friendModalClick, true);
        item.addEventListener('click', friendModalClick);
    });
}