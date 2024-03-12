class Login {
    modalTemplate() {
        return `
        <div class="modal__container modal-name__2FA">
            <div class="modal__background"></div>
                <div class="profile__search__modal__container">
                    <form class="login__2FA">
                        <input id="login__2FA--input" type="text" placeholder="type 2FA code in your email ..."/>
                        <button class="login__2FA--btn">
                            <i class="bi bi-search"></i>
                            confirm
                        </button>
                    </form>
                </div>
            </div>
        </div>
        `;
    }

	template() {
		return `
        <div class="modal__container">
            <div class="login__background"></div>
            <div class="login__container">
                <div class="login__container--header">Pong</div>
                <div class="login__container--body">
                    <div class="login__wrapper--header">Login</div>
                    <div class="login__wrapper--list">
                        <div class="login-btn google">
                            <i class="bi bi-google"></i>
                            <div>google</div>
                        </div>
                        <div class="login-btn intra">
                            <img src="src/assets/42_logo.svg" alt="42logo" />
                            <div>intra</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
		`;
	}
}

export default new Login();