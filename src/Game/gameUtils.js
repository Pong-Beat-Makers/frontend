import PlayGameModalTemplate from "../Modals/playGameModalTemplate.js";

const TWO_PLAYER_BTN = 0;
const RANDOM_BTN = 1;
const TOURNAMENT_BTN = 2;


export function handleGameModal() {
    const playBtn = document.querySelectorAll('.game__playbtn');

    playBtn[RANDOM_BTN].addEventListener('click', () => {
        const modal = document.querySelector('.modal');

        modal.innerHTML = PlayGameModalTemplate.matchTemplate();

        document.querySelector('.matching-game__btn').addEventListener('click', () => {
            modal.innerHTML = '';
        });
    });
}