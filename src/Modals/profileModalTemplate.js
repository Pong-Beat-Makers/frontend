class ProfileModal {
    profileSearchResultTemplate(nickname) {
		return `
            <div class="profile-section__friends--item">
                <div class="profile-section__friends--profile">
                    <div class="profile-section__friends--pic"></div>
                    <div class="profile-section__friends--name">${nickname}</div>
                </div>
            </div>
        `;
    }

    profileSearchTemplate() {
        return `
        <div class="modal__container modal-name__friend-profile">
            <div class="modal__background"></div>
            <div class="profile__search__modal__container">
                <form class="profile__search">
                    <input id="profile__search--input" type="text" placeholder="Profile Search"/>
                    <button class="profile__search--btn">🔍</button>
                </form>
                <div class="profile__result--list">
                </div>
            </div>
        </div>
        `;
    }

    template() {
        return `
<div class="modal__container modal-name__profile">
    <div class="modal__background"></div>
    <div class="profile-modal__container">
        <div class="profile-modal__header">Edit Profile</div>
        <div class="profile-modal__body">
            <div class="profile-modal__body--header">profile</div>
            <div class="profile-modal__body--content">
                <div class="profile-modal__avator profile-modal__big-avator image_cat"></div>
                <div class="profile-modal__avatorlist">
                    <div class="profile-modal__avator image_bird"></div>
                    <div class="profile-modal__avator image_gadget"></div>
                    <div class="profile-modal__avator image_crocodile"></div>
                    <div class="profile-modal__avator image_dolphin"></div>
                </div>
            </div>
            <div class="profile-modal__body--header">nickname</div>
            <div class="profile-modal__body--content">
                <textarea class="profile-modal__nickname" name="profile-modal__nickname" maxlength="15"></textarea>
                <div class="profile-modal__text--length"><span>0</span>/15</div>
            </div>
            <div class="profile-modal__body--header">status message</div>
            <div class="profile-modal__body--content">
                <textarea class="profile-modal__status-message" name="profile-modal__status-message" maxlength="50"></textarea>
                <div class="profile-modal__text--length"><span>0</span>/50</div>
            </div>
            <button class="profile-modal__save-btn">
                <i class="bi bi-floppy"></i>
                save
            </button>
        </div>
    </div>
</div>
        `
    }
}

export default new ProfileModal();