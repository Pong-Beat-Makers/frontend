import { routes } from "../route.js";
import {modalRender} from "../Profile/modalUtils.js";
import SocketApp from "./SocketApp.js";
import { GAME_TYPE } from "./gameTemplate.js";
import {player} from "../app.js";

export function openPlayGameModal(socketApp, gameType, playerNames) {
    const modalContainer = modalRender('play-game', routes['/game'].playGameTemplate(), false);

    modalContainer.querySelector('.playgame__btn').addEventListener('click', () => {
        socketApp.gameClose();
        modalContainer.remove();
    });
    setupNameAtModal(modalContainer, gameType, playerNames);

    socketApp.setGameContainer(modalContainer);
    socketApp.setGameCanvas(modalContainer.querySelector('#game_playground'));
}

export function openMatchingModal(gameType) {
    const modalContainer = modalRender('matching-game', routes['/game'].matchModalTemplate(gameType), false);
    const socketApp = SocketApp;

    socketApp.matching(gameType);

    document.querySelector('.matching-game__btn').addEventListener('click', () => {
        closeMatchingModal(modalContainer, socketApp);
    });

    socketApp.setMatchingContainer(modalContainer);
}

export function openBoardModal(socketApp, gameType, playerNames) {
    let modalName;
    let modalHtml;

    if (gameType === GAME_TYPE.TOURNAMENT) {
        modalName = "tournament";
        modalHtml = routes['/game'].tournamentModalTemplate();
    } else {
        modalName  = "versus";
        modalHtml = routes['/game'].versusModalTemplate();
    }

    const modalContainer = modalRender(modalName, modalHtml, false);

    if (gameType === GAME_TYPE.TWO_PLAYER) {
        modalContainer.querySelector('.modal__ready-btn').addEventListener('click', () => {
            // const info = modalContainer.querySelector('.board-modal__info');
            //
            // info.classList.add('ingAnimation');
            // info.innerHTML = "Waiting for the other one .";
            //
            // setupActiveReadyBtn(modalContainer);
            socketApp.readyToPlay();
        });
    }

    setupNameAtModal(modalContainer, gameType, playerNames);
    socketApp.setBoardContainer(modalContainer);
}

export function closeMatchingModal(matchingContainer, socketApp) {
    socketApp.waitClose();
    matchingContainer.remove();
}

export function setupNameAtModal(container, gameType, playerNames) {
    if (Array.isArray(playerNames)) {
        const insertNameContainer = container.querySelectorAll('.insert-playerName');

        if (insertNameContainer.length > 0) {
            if (playerNames[0] !== undefined) {
                insertNameContainer[0].innerHTML = playerNames[0];
            }
            if (playerNames[1] !== undefined) {
                insertNameContainer[1].innerHTML = playerNames[1];
            }
        }
    }
}

export function setupConnectPeopleAtMatchingModal(container, playerNumber) {
    const statusInfo = container.querySelector('.matching-game__status');

    statusInfo.querySelector('span').innerHTML = playerNumber;
}

export function setupDeActiveReadyBtn(container) {
    container.querySelector('.modal__ready-btn').disabled = true;
}

export function setupActiveReadyBtn(container) {
    container.querySelector('.modal__ready-btn').disabled = false;
}

export function changeGiveUpToEnd(container) {
    const giveUpBtn = container.querySelector('.playgame__btn');

    giveUpBtn.innerHTML = '<i class="bi bi-door-closed"></i> Exit';
}

export function setupAvatarAtTournament(container, players) {
    // profile 추가
    console.log("users:", players);
}

export function handleGameModal() {
    const playBtn = document.querySelectorAll('.game__playbtn');

    playBtn[GAME_TYPE.TWO_PLAYER].addEventListener('click', () => {
        const socketApp = SocketApp;

        socketApp.localPlay();
    });

    playBtn[GAME_TYPE.RANDOM].addEventListener('click', () => {
        openMatchingModal(GAME_TYPE.RANDOM);
    });

    playBtn[GAME_TYPE.TOURNAMENT].addEventListener('click', () => {
        openMatchingModal(GAME_TYPE.TOURNAMENT);
    });
}

export function renderEndStatus(gameContainer, gamePlayer, score, gameType) {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('game-modal__container');

    let status = 'YOU <span class="game-modal__win">WIN!</span>';

    if (gameType === GAME_TYPE.TWO_PLAYER) {
        if (score[0] > score[1]) {
            status = `${player.getNickName()} <span class="game-modal__win">WIN!</span>`;
        } else {
            status = `GUEST <span class="game-modal__win">WIN!</span>`;
        }
    } else {
        if (gamePlayer === 1 && score[0] < score[1]) {
            status = 'YOU <span class="game-modal__lose">LOSE..</span>';
        } else if (gamePlayer === 2 && score[0] > score[1]) {
            status = 'YOU <span class="game-modal__lose">LOSE..</span>';
        }
    }

    modalContainer.innerHTML = routes['/game'].gameEndModalTemplate(status, score);
    gameContainer.appendChild(modalContainer);
}

export function openErrorModal(comment) {
    const modalContainer = modalRender('matching-game', routes['/game'].errorModalTemplate(comment));

    modalContainer.querySelector('.matching-game__btn').addEventListener('click', () => {
        modalContainer.remove();
    });
}