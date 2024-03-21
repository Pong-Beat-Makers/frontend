import ProfileModal from "./profileModalTemplate.js";
import {PROFILE_DEFAULT_IMAGE} from '../Login/player.js';
import {player} from "../app.js";

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

export function friendModalClick() {
    modalRender("friend-profile", ProfileModal.friendModalTemplate());
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

    if (avatars[1].classList.contains(selectedClassName) && avatars[1].getAttribute('data-image').length) {
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

    profileBtn.addEventListener('click', () => {
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
            if (player.setProfile(data)) {
                location.reload();
            }
        });
    });
}

export function handleFriendModalUtils(app) {
    const frendItems = app.querySelectorAll('.profile-section__friends--item');

    frendItems.forEach(item => {
        item.removeEventListener('click', friendModalClick, true);
        item.addEventListener('click', friendModalClick);
    });
}

export function setAvator(playerProfile, divNode) {
    if (PROFILE_DEFAULT_IMAGE.indexOf(playerProfile) === -1) {
        divNode.style.backgroundImage = `url(${playerProfile})`;
    } else {
        divNode.setAttribute('data-image', playerProfile);
    }
}