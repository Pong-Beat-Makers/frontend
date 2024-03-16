import { routes } from "../route.js";
import {modalRender} from "../Profile/modalUtils.js";
import SocketApp, {SOCKET_STATE} from "./SocketApp.js";

const TWO_PLAYER_BTN = 0;
const RANDOM_BTN = 1;
const TOURNAMENT_BTN = 2;


export function openPlayGameModal(socketApp) {
    modalRender('play-game', routes['/game'].playGameTemplate(), false);

    const modalContainer = document.querySelector('.modal-name__play-game');

    modalContainer.querySelector('.playgame__btn').addEventListener('click', () => {
        if (socketApp.isGameState() === SOCKET_STATE.OPEN || socketApp.isGameState() === SOCKET_STATE.CONNECTING) {
            socketApp.gameClose();
        }

        modalContainer.remove();
    });
    return modalContainer;
}
export function closeMatchingModal(socketApp) {
    const modalContainer = document.querySelector('.modal-name__matching-game');

    if (socketApp.isWaitState() === SOCKET_STATE.OPEN || socketApp.isWaitState() === SOCKET_STATE.CONNECTING) {
        socketApp.waitClose();
    }

    modalContainer.remove();
}

export function setupName(container, player1, player2) {
    const proiles = container.querySelectorAll('.playgame__header--profile');
    if (player1 !== undefined) {
        proiles[0].querySelector('.playgame__header--name').innerHTML = player1;
    }

    if (player2 !== undefined) {
        proiles[1].querySelector('.playgame__header--name').innerHTML = player2;
    }
}

export function handleGameModal() {
    const playBtn = document.querySelectorAll('.game__playbtn');

    playBtn[RANDOM_BTN].addEventListener('click', () => {
        modalRender('matching-game', routes['/game'].matchModalTemplate(), false);
        const socketApp = SocketApp;

        socketApp.randomMatching();

        document.querySelector('.matching-game__btn').addEventListener('click', () => {
            closeMatchingModal(socketApp);
        });
    });
}