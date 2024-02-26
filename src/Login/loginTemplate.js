class Login {
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