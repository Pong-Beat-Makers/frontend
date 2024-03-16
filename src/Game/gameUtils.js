import { routes } from "../route.js";
import {modalRender} from "../Profile/modalUtils.js";
import SocketApp from "./SocketApp.js";
import { GAME_TYPE } from "./gameTemplate.js";

export function openPlayGameModal(socketApp, gameType, playerNames) {
    modalRender('play-game', routes['/game'].playGameTemplate(), false);

    const modalContainer = document.querySelector('.modal-name__play-game');

    modalContainer.querySelector('.playgame__btn').addEventListener('click', () => {
        socketApp.gameClose();
        modalContainer.remove();
    });
    setupNameAtModal(modalContainer, gameType, playerNames);

    socketApp.setGameContainer(modalContainer);
    socketApp.setGameCanvas(modalContainer.querySelector('#game_playground'));
}

export function closeMatchingModal(socketApp) {
    const modalContainer = document.querySelector('.modal-name__matching-game');
    socketApp.waitClose();
    modalContainer.remove();
}

export function openVersusModal(socketApp, playerNames) {
    modalRender('versus', routes['/game'].versusModalTemplate(), false);

    const modalContainer = document.querySelector('.modal-name__versus');

    modalContainer.querySelector('.versus-modal__btn').addEventListener('click', () => {
        const info = modalContainer.querySelector('.board-modal__info');
        info.classList.add('ingAnimation');
        info.innerHTML = "Waiting for the other one.";

        setupDeActiveReadyBtn(modalContainer);
        socketApp.readyToPlay();
    });
    setupNameAtModal(modalContainer, GAME_TYPE.RANDOM, playerNames);

    socketApp.setBoardContainer(modalContainer);
}

export function openTournamentModal(socketApp) {
    modalRender('tournament', routes['/game'].tournamentModalTemplate(), false);

    const modalContainer = document.querySelector('.modal-name__tournament');

    modalContainer.querySelector('.tournament__btn').addEventListener('click', () => {
        socketApp.gameClose();
        modalContainer.remove();
    });
}

export function setupNameAtModal(container, type, playerNames) {
    if (Array.isArray(playerNames)) {
        if (type === GAME_TYPE.RANDOM) {
            const insertNameContainer = container.querySelectorAll('.insert-playerName');

            if (playerNames[0] !== undefined) {
                insertNameContainer[0].innerHTML = playerNames[0];
            }
            if (playerNames[1] !== undefined) {
                insertNameContainer[1].innerHTML = playerNames[1];
            }
        }
    }
}

export function setupDeActiveReadyBtn(container) {
    container.querySelector('.modal__ready-btn').disabled = true;
}

export function setupActiveReadyBtn(container) {
        container.querySelector('.modal__ready-btn').disabled = false;
}

export function setupAvatorAtTournament(container, players) {
    // profile 추가
    console.log("users:", players);
}

export function handleGameModal() {
    const playBtn = document.querySelectorAll('.game__playbtn');

    playBtn[GAME_TYPE.RANDOM].addEventListener('click', () => {
        modalRender('matching-game', routes['/game'].matchModalTemplate(GAME_TYPE.RANDOM), false);
        const socketApp = SocketApp;

        socketApp.randomMatching();

        document.querySelector('.matching-game__btn').addEventListener('click', () => {
            closeMatchingModal(socketApp);
        });
    });

    playBtn[GAME_TYPE.TOURNAMENT].addEventListener('click', () => {
        modalRender('matching-game', routes['/game'].matchModalTemplate(GAME_TYPE.TOURNAMENT), false);
        const socketApp = SocketApp;

        socketApp.tournamentMatching();

        document.querySelector('.matching-game__btn').addEventListener('click', () => {
            closeMatchingModal(socketApp);
        });
    });
}