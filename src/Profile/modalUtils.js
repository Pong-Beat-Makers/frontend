import ProfileModal from "./profileModalTemplate.js";
import {DOING, PROFILE_DEFAULT_IMAGE} from '../Login/player.js';
import {player} from "../app.js";
import {openErrorModal} from "../Game/gameUtils.js";
import {showChatroom} from "../Chat/chatRoomUtils.js";

export function toggleAddAndDeleteBtn(btnNode, nickname, doing) {
    const buttonMsg = ['<i class="bi bi-person-plus"></i> add', '<i class="bi bi-person-plus"></i> delete'];

    btnNode.innerHTML = doing === DOING.ADD? buttonMsg[0]:buttonMsg[1];
    if (doing === DOING.ADD) {
        btnNode.onclick = async () => {
            const result = await player.friend(nickname, doing);

            if (result) {
                btnNode.innerHTML = buttonMsg[1];
                toggleAddAndDeleteBtn(btnNode, nickname, DOING.DELETE);
            } else {
                btnNode.innerHTML = buttonMsg[0];
                toggleAddAndDeleteBtn(btnNode, nickname, DOING.ADD);
            }
        }
    } else {
        btnNode.onclick = async () => {
            const result = await player.friend(nickname, doing);

            if (result) {
                btnNode.innerHTML = buttonMsg[1];
                toggleAddAndDeleteBtn(btnNode, nickname, DOING.ADD);
            } else {
                btnNode.innerHTML = buttonMsg[0];
                toggleAddAndDeleteBtn(btnNode, nickname, DOING.DELETE);
            }
        }
    }
}

export function  modalRender(modalName, htmlCode, backgroundClick = true) {
    const modal = document.querySelector('.modal');
    const modalContainer = document.createElement('div');

    modalContainer.classList.add('modal__container', `modal-name__${modalName}`);
    modalContainer.innerHTML = htmlCode;

    modal.appendChild(modalContainer);

    if (backgroundClick) {
        modalContainer.querySelector('.modal__background').addEventListener('click', () => {
            if (modalContainer !== undefined) modalContainer.remove();
        });
    }
    return modalContainer;
}

export async function friendModalClick(nickname, me = false) {
    const data = await player.getUserDetail(nickname);
    const modalContainer = modalRender("friend-profile", ProfileModal.friendModalTemplate());

    const {
        nickname: name,
        profile,
        status_message,
        win,
        lose,
        rank,
        is_friend
    } = data;

    const avatarNode = modalContainer.querySelector('.friend-modal__avatar');
    const friendInfo = modalContainer.querySelector('.friend-modal__info').children;
    const winRate = modalContainer.querySelector('.friend-modal__game-info--rate').children[0];
    const rankPoint = modalContainer.querySelector('.friend-modal__game-info--rank').children[0];
    const profileBtns = modalContainer.querySelectorAll(".friend-modal__btn");

    setAvatar(profile, avatarNode);

    friendInfo[0].innerHTML = name;
    friendInfo[1].innerHTML = status_message;

    winRate.innerHTML = (win + lose)? `${(win/(win+lose)).toPrecision(5) * 100}%` : '0';
    rankPoint.innerHTML = rank;

    profileBtns[0].onclick = () => {
        showChatroom(nickname);
    }
    toggleAddAndDeleteBtn(profileBtns[1], nickname, is_friend? DOING.DELETE : DOING.ADD);
}

export function handleFileInputAtDiv(avatars, selectedClassName) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', e => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = e => {
                avatars[1].style.backgroundImage = `url(${e.target.result})`;
                avatars[1].setAttribute('data-image', e.target.result);
            }

            reader.readAsDataURL(file);
        } else {
            avatars[0].classList.toggle(selectedClassName);
            avatars[1].classList.toggle(selectedClassName);
        }
    });

    fileInput.click();
}

function getAvatarData(avatars) {
    const selectedClassName = 'profile-modal__selected-avatar';

    if (avatars[1].classList.contains(selectedClassName) && avatars[1].getAttribute('data-image') !== 'upload') {
        return avatars[1].getAttribute('data-image');
    }
    return avatars[0].getAttribute('data-image');
}

function get2FAData(toggleItems) {
    const selectedClassName = 'profile-modal__toggle-selected';

    return toggleItems[0].classList.contains(selectedClassName);
}

export function handleEditUserModalUtils(app) {
    const profileBtn = app.querySelector('.profile-section__profile');
    const avatar = profileBtn.querySelector('.profile-section__profile--avatar');
    const editBtn = profileBtn.querySelector('.profile-section__profile--info > div:nth-child(2) div:last-child');

    avatar.addEventListener('click', async () => {
        await friendModalClick(player.getNickName(), true);
    });

    editBtn.addEventListener('click', () => {
        const modalContainer = modalRender("profile", ProfileModal.template());

        const nickname = modalContainer.querySelector('.profile-modal__nickname');
        const status_message = modalContainer.querySelector('.profile-modal__status-message');

        nickname.value = player.getNickName();
        status_message.value = player.getStatusMessage();

        modalContainer.querySelectorAll('textarea').forEach(element => {
            element.addEventListener('keyup', e => {
                const textLenLimit = e.target.nextElementSibling.firstElementChild;

                textLenLimit.innerHTML = `${e.target.value.length}`;
            });
        });

        const avatars = modalContainer.querySelectorAll('.profile-modal__avatar');

        if (PROFILE_DEFAULT_IMAGE.indexOf(player.getProfile()) === -1) {
            setAvatar(player.getProfile(), avatars[1]);
            avatars[0].classList.toggle('profile-modal__selected-avatar');
            avatars[1].classList.toggle('profile-modal__selected-avatar');
        } else {
            setAvatar(player.getProfile(), avatars[0]);
        }

        avatars.forEach((element, i) => {
            element.addEventListener('click', e => {
                const selectedClassName = 'profile-modal__selected-avatar';

                if (avatars[1] === e.target) {
                    handleFileInputAtDiv(avatars, selectedClassName);
                }

                if (e.target.classList.contains(selectedClassName)) {
                    if (i === 0) {
                        const curr = e.target.getAttribute('data-image');

                        e.target.setAttribute('data-image', PROFILE_DEFAULT_IMAGE[(PROFILE_DEFAULT_IMAGE.indexOf(curr) + 1) % PROFILE_DEFAULT_IMAGE.length]);
                    }
                } else {
                    avatars[0].classList.toggle(selectedClassName);
                    avatars[1].classList.toggle(selectedClassName);
                }
            })
        });

        const toggleItems = modalContainer.querySelectorAll('.profile-modal__toggle-item');

        if (!player.getSet2fa()) {
            toggleItems[0].classList.toggle('profile-modal__toggle-selected');
            toggleItems[1].classList.toggle('profile-modal__toggle-selected');
        }

        toggleItems.forEach((element, i) => {
            element.addEventListener('click', e => {
                const selectedClassName = 'profile-modal__toggle-selected';

                if (!(toggleItems[i].classList.contains(selectedClassName))) {
                    toggleItems[0].classList.toggle(selectedClassName);
                    toggleItems[1].classList.toggle(selectedClassName);
                }
            });
        });

        modalContainer.querySelector('.profile-modal__save-btn').addEventListener('click', e =>  {
            const data = {
                'profile_to': getAvatarData(avatars),
                'nickname_to': nickname.value,
                'status_message_to': status_message.value,
                'set_2fa_to': get2FAData(toggleItems)
            };

            if ((player.getNickName() !== nickname.value && /User\d+$/.test(nickname.value)) || nickname.value.includes('\n')) {
                openErrorModal(`${nickname.value} is not vaild.`);
            } else {
                if (player.setProfile(data)) {
                    location.reload();
                }
            }
        });
    });
}

export async function handleFriendItemUtils(nickname) {
    await friendModalClick(nickname);
}

export function setAvatar(playerProfile, divNode) {
    if (PROFILE_DEFAULT_IMAGE.indexOf(playerProfile) === -1) {
        divNode.style.backgroundImage = `url(${playerProfile})`;
    } else {
        divNode.setAttribute('data-image', playerProfile);
    }
}