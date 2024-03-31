import { routes } from "../route.js";
import {modalRender, setAvatar} from "../Profile/modalUtils.js";
import SocketApp from "./SocketApp.js";
import { GAME_TYPE } from "./gameTemplate.js";
import {player} from "../app.js";
import {PROFILE_DEFAULT_IMAGE} from "../Login/player.js";
import {closedChatLog} from "../Chat/chatSocketUtils.js";

export function generateGuest(guestName = 'GUEST', avoidList = []) {
    let profileIdx = Math.floor(Math.random() * PROFILE_DEFAULT_IMAGE.length);
    const avoidIdx = avoidList.map(item => PROFILE_DEFAULT_IMAGE.indexOf(item));

    for (let i = 0; i < PROFILE_DEFAULT_IMAGE.length; ++i) {
        if (avoidIdx.includes(profileIdx)) {
            profileIdx = (profileIdx + 1) % PROFILE_DEFAULT_IMAGE.length;
        }
    }

    return {
        'profile': PROFILE_DEFAULT_IMAGE[profileIdx],
        'nickname': guestName
    };
}

export async function getInfoPlayerList(playerIds) {
    let players = [];
    for (const playerId of playerIds) {
        let data;
        try {
            data = await player.getUserDetail(playerId);
        } catch (e) {
            // TODO: alert user server status
            let avoidAvatar = [];
            data = generateGuest('player', avoidAvatar);
            avoidAvatar.push(data.profile);
        }

        players.push(data);
    }
    return players;
}

export function orderPlayers(playerNumber, players) {
    if (playerNumber === 2) {
        [players[0], players[1]] = [players[1], players[0]];
    } else if (playerNumber === 3) {
        [players[0], players[1], players[2], players[3]] = [players[2], players[3], players[0], players[1]];
    } else if (playerNumber === 4) {
        [players[0], players[1], players[2], players[3]] = [players[3], players[2], players[0], players[1]];
    }
    return players;
}

// TODO: gameType 전달 필요 없음
export function openPlayGameModal(socketApp, gameType, players) {
    const modalContainer = modalRender('play-game', routes['/game'].playGameTemplate(), false);
    const playGround = modalContainer.querySelector('#game_playground');

    modalContainer.querySelector('.exitgame__btn').addEventListener('click', () => {
        socketApp.gameClose();
        modalContainer.remove();
        socketApp.cancelRenderGameApp();
    });
    setupInfoAtModal(modalContainer, gameType, players);

    socketApp.setGameContainer(modalContainer);
    socketApp.setGameCanvas(playGround);

    playGround.focus();

    const focusOutEvent = playGround.addEventListener('focusout', () => {
        toggleFocusOut(playGround, true);
    });

    playGround.addEventListener('focusin', () => {
        toggleFocusOut(playGround, false);
    })
}

export function openMatchingModal(gameType) {
    const modalContainer = modalRender('matching-game', routes['/game'].matchModalTemplate(gameType), false);
    const socketApp = SocketApp;

    socketApp.matching(gameType);

    modalContainer.querySelector('.matching-game__btn').addEventListener('click', () => {
        closeMatchingModal(modalContainer, socketApp);
    });

    socketApp.setMatchingContainer(modalContainer);
}

export function openBoardModal(socketApp, gameType, players) {
    let modalName;
    let modalHtml;

    if (gameType === GAME_TYPE.TOURNAMENT || gameType === GAME_TYPE.TWO_TOURNAMENT) {
        modalName = "tournament";
        modalHtml = routes['/game'].tournamentModalTemplate();
    } else {
        modalName  = "versus";
        modalHtml = routes['/game'].versusModalTemplate();
    }

    const modalContainer = modalRender(modalName, modalHtml, false);

    if (gameType === GAME_TYPE.TWO_PLAYER || gameType === GAME_TYPE.TWO_TOURNAMENT) {
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

    socketApp.setBoardContainer(modalContainer);
    setupInfoAtModal(modalContainer, gameType, players, gameType === GAME_TYPE.RANDOM || gameType === GAME_TYPE.TWO_PLAYER);
}

export function closeMatchingModal(matchingContainer, socketApp) {
    socketApp.waitClose();
    matchingContainer.remove();
}

// TODO: gameType 전달 필요 없음
export function setupInfoAtModal(container, gameType, players, setName = true) {
    const avatarNodes = container.querySelectorAll('.insert-playerAvatar');
    const nameNodes = container.querySelectorAll('.insert-playerName');

    players.forEach((playerData, i) => {
        const {profile, nickname} = playerData;

        if (avatarNodes[i] !== undefined) {
            setAvatar(profile, avatarNodes[i]);
            if (setName) {
                nameNodes[i].innerHTML = nickname;
            }
        }
    });
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
    const giveUpBtn = container.querySelector('.exitgame__btn');

    giveUpBtn.innerHTML = '<i class="bi bi-door-closed"></i> Exit';
}

export function changeEndToNextMatch(container) {
    const endBtn = container.querySelector('.exitgame__btn');

    endBtn.innerHTML = '<i class="bi bi-door-closed"></i> Next Match';
}

export function setInfoMessageAtModal(modalContainer, message, ingAnimation = false) {
    const info = modalContainer.querySelector('.board-modal__info');

    if (ingAnimation) {
        info.classList.add('ingAnimation');
    }

    info.innerHTML = message;
}

export function handleGameModal() {
    const playBtn = document.querySelectorAll('.game__playbtn');

    playBtn[GAME_TYPE.LOCAL_GAME].addEventListener('click', () => {
        const socketApp = SocketApp;

        const modalHtml = routes['/game'].localGameModalTemplate();
        const modalContainer = modalRender('local-play-select', modalHtml, false);
        const modalBtns = modalContainer.querySelectorAll('.matching-game__btn');
        
        modalBtns[0].addEventListener('click', () => {
            socketApp.localTwo();
            closeMatchingModal(modalContainer, socketApp);
        });
        modalBtns[1].addEventListener('click', () => {
            const aliasModalTemplate = routes['/game'].localTournamentAliasTemplate();
            const aliasModalContainer = modalRender('local-tournament-alias', aliasModalTemplate, false);
            const aliasModalBtns = aliasModalContainer.querySelectorAll('.matching-game__btn');

            aliasModalBtns[0].addEventListener('click', () => {
                const aliasNames = aliasModalContainer.querySelectorAll('.search-friend__body--input');
                const userList = [];
                
                aliasNames.forEach((aliasName) => {
                  const opponent = generateGuest(aliasName.value, userList.map(user => user.profile));
                  userList.push(opponent);
                });

                socketApp.localTournament(userList);
                closeMatchingModal(aliasModalContainer, socketApp);
                closeMatchingModal(modalContainer, socketApp);
            })
            aliasModalBtns[1].addEventListener('click', () => {
                closeMatchingModal(aliasModalContainer, socketApp);
            })
        });
        modalBtns[2].addEventListener('click', () => {
            closeMatchingModal(modalContainer, socketApp);
        });
    })

    playBtn[GAME_TYPE.RANDOM].addEventListener('click', () => {
        openMatchingModal(GAME_TYPE.RANDOM);
    });

    playBtn[GAME_TYPE.TOURNAMENT].addEventListener('click', () => {
        openMatchingModal(GAME_TYPE.TOURNAMENT);
    });
}

export function toggleFocusOut(gameContainer, isNotFocus = true) {
    if (gameContainer.querySelector('.game-modal-name__end') !== null) {
        return ;
    }

    if (isNotFocus) {
        const modalContainer = document.createElement('div');
        modalContainer.classList.add('game-modal__container', 'game-modal-name__focus');

        modalContainer.innerHTML = routes['/game'].gameInfoModalTemplate('Out of focus');

        gameContainer.appendChild(modalContainer);
    } else {
        const modalContainer = gameContainer.querySelector('.game-modal__container.game-modal-name__focus');
        if (modalContainer !== null) {
            modalContainer.remove();
        }
    }
}

export function renderEndStatus(gameContainer, gamePlayer, score, gameType) {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('game-modal__container', 'game-modal-name__end');

    let status = 'YOU <span class="game-modal__win">WIN!</span>';

    if (gameType === GAME_TYPE.TWO_PLAYER && !localStorage.getItem("local_tournament")) {
        if (score[0] > score[1]) {
            status = `${player.getNickName()} <span class="game-modal__win">WIN!</span>`;
        } else {
            status = `GUEST <span class="game-modal__win">WIN!</span>`;
        }
    } else if (gameType === GAME_TYPE.TWO_PLAYER || gameType === GAME_TYPE.TWO_TOURNAMENT) {
        const players = gameContainer.parentNode.parentNode.querySelectorAll('.playgame__header--profile');
        let winnerIdx = 0;

        if (score[0] > score[1]) {
            status = `${players[0].children[1].innerText} <span class="game-modal__win">WIN!</span>`;
        } else {
            winnerIdx = 1;
            status = `${players[1].children[1].innerText} <span class="game-modal__win">WIN!</span>`;
        }

        let winnerProfile = players[winnerIdx].children[0].getAttribute('data-image');
        let winnerName = players[winnerIdx].children[1].innerText;

        if (gameType === GAME_TYPE.TWO_PLAYER)
            localStorage.removeItem("local_tournament");
        else {
            let winners;
            localStorage.getItem("local_tournament") ? winners = JSON.parse(localStorage.getItem("local_tournament")) : winners = [];
            winners.push({profile: winnerProfile, nickname: winnerName});
            localStorage.setItem("local_tournament", JSON.stringify(winners));
        }
    } else {
        if (gamePlayer === 1 && score[0] < score[1]) {
            status = 'YOU <span class="game-modal__lose">LOSE..</span>';
        } else if (gamePlayer === 2 && score[0] > score[1]) {
            status = 'YOU <span class="game-modal__lose">LOSE..</span>';
            [score[0], score[1]] = [score[1], score[0]];
        }
    }

    modalContainer.innerHTML = routes['/game'].gameEndModalTemplate(status, score);
    gameContainer.appendChild(modalContainer);
}

export function removeExitBtnInfoModal(container) {
    container.querySelector('.matching-game__btn').remove();
}

export function exitInviteGame(container, socketApp, chatApp, userDetail) {
    container.querySelector('.matching-game__btn').addEventListener('click', () => {
        socketApp.gameClose();
        // TODO: invite Game Cancel event
        chatApp.cancelInviteGame(userDetail.id);
    })
}

export function setCommentInfoModal(container, comment) {
    const commentNode = container.querySelector('.matching-game__wrapper span');

    commentNode.innerHTML = comment;
}

export function openInfoModal(comment, backgroundClick = true) {
    const modalContainer = modalRender('matching-game', routes['/game'].infoModalTemplate(comment), backgroundClick);

    modalContainer.querySelector('.matching-game__btn').addEventListener('click', () => {
        modalContainer.remove();
    });
    return modalContainer;
}