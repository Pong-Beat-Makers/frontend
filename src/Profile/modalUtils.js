import ProfileModal from "./profileModalTemplate.js";

export function  modalRender(modalName, htmlCode) {
    const modal = document.querySelector('.modal');

    modal.innerHTML += htmlCode;

    document.querySelector('.modal__background').addEventListener('click', () => {
        const modalContainer = document.querySelector(`.modal-name__${modalName}`);
        if (modalContainer !== undefined)  modalContainer.remove();
    });
}

export function friendModalClick() {
    modalRender("friend-profile", ProfileModal.friendModalTemplate());
}

export function handleEditUserModalUtils() {
    const profileBtn = document.querySelector('.profile-section__profile');

    profileBtn.addEventListener('click', () => {
        modalRender("profile", ProfileModal.template());

        document.querySelectorAll('textarea').forEach(element => {
            element.addEventListener('keyup', e => {
                const textLenLimit = e.target.nextElementSibling.firstElementChild;

                textLenLimit.innerHTML = `${e.target.value.length}`;
            });
        });

        document.querySelectorAll('.profile-modal__avatorlist > .profile-modal__avator').forEach(element => {
            element.addEventListener('click', e => {
                e.target.classList.forEach(c => {
                    if (c.startsWith('image_')) {
                        document.querySelector('.profile-modal__big-avator').classList.remove()
                    }
                });
            });
        });
    })
}

export function handleFriendModalUtils() {
    const frendItems = document.querySelectorAll('.profile-section__friends--item');

    frendItems.forEach(item => {
        item.removeEventListener('click', friendModalClick, true);
        item.addEventListener('click', friendModalClick);
    });
}