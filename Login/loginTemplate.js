class Login {
	template() {
		return `
        <div id="container_login">
            <main class="main_login">
                <div class="wrapper_login">
                    <div class="item_one">
                        42tsc_Pong logo
                    </div>
                    <div class="item_two">
                        <div class="login_header">
                            Login with
                        </div>
                        <div class="login_box">
                            <div class="login_logo"></div>
                            <div class="login_name">Google</div>
                        </div>
                        <div class="login_box">
                            <div class="login_logo"></div>
                            <div class="login_name">42 Network</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
		`;
	}
}

export default new Login();