import ProfileModal from "./profileModalTemplate.js";
import FriendModalTemplate from "./friendModalTemplate.js";

function friendModalClick() {
    const modal = document.querySelector('.modal');

    modal.innerHTML = FriendModalTemplate.template();

    document.querySelector('.modal__background').addEventListener('click', () => {
        const modalContainer = document.querySelector('.modal-name__friend-profile');
        if (modalContainer !== undefined)  modalContainer.remove();
    });
}

export function handleEditUserModalUtils() {
    const profileBtn = document.querySelector('.profile-section__profile');

    profileBtn.addEventListener('click', () => {
        const modal = document.querySelector('.modal');

        modal.innerHTML += ProfileModal.template();

        document.querySelector('.modal__background').addEventListener('click', () => {
            const modalContainer = document.querySelector('.modal-name__profile');
            if (modalContainer !== undefined)  modalContainer.remove();
        });

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