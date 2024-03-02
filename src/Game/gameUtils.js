import Game from './gameTemplate.js';
import PlayGameApp from "./gameApp.js";

export function handleGameModal() {
    const playBtn = document.querySelectorAll('.game__playbtn');

    playBtn[0].addEventListener('click', () => {
        const modal = document.querySelector('.modal');

        modal.innerHTML = Game.modalTemplate();

        document.querySelector('.playgame__btn').addEventListener('click', () => {
            modal.innerHTML = '';
        });
        new PlayGameApp();
    });
}