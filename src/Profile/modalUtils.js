import ProfileModal from "./profileModalTemplate.js";

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

export function handleEditUserModalUtils(app) {
    const profileBtn = app.querySelector('.profile-section__profile');

    profileBtn.addEventListener('click', () => {
        const modalContainer = modalRender("profile", ProfileModal.template());

        modalContainer.querySelectorAll('textarea').forEach(element => {
            element.addEventListener('keyup', e => {
                const textLenLimit = e.target.nextElementSibling.firstElementChild;

                textLenLimit.innerHTML = `${e.target.value.length}`;
            });
        });

        modalContainer.querySelectorAll('.profile-modal__avatarlist > .profile-modal__avatar').forEach(element => {
            const bigAvatar = modalContainer.querySelector('.profile-modal__big-avatar');
            const dataName = 'avatar__image-';

            element.addEventListener('click', e => {
                const currAvatar = bigAvatar.getAttribute('data-name').substring(dataName.length);
                const clickAvatar = e.target.getAttribute('data-name').substring(dataName.length);

                bigAvatar.setAttribute('data-name', dataName + clickAvatar);
                e.target.setAttribute('data-name', dataName + currAvatar);
            });
        });
    })
}

export function handleFriendModalUtils(app) {
    const frendItems = app.querySelectorAll('.profile-section__friends--item');

    frendItems.forEach(item => {
        item.removeEventListener('click', friendModalClick, true);
        item.addEventListener('click', friendModalClick);
    });
}