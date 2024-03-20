class LoginSuccess {
    friendBoxTemplate() {
        return `
            <div class="profile-section__friends--item">
                <div class="profile-section__friends--profile">
                    <div class="profile-section__friends--pic"></div>
                    <div class="profile-section__friends--name">friend</div>
                </div>
                <div class="profile-section__friends--status">
                    <div class="profile-section__friends--status--text">online</div>
                    <div></div>
                </div>
            </div>
        `;
    }

	template() {
		return `
        <header>
            <div class="header__logo">
                <div class="header__logo--text">Pong</div>
            </div>
            <div class="header__logout">
                <button class="header__logout--btn">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Logout</span>
                </button>
            </div>
        </header>
        <div class="wrapper">
            <section class="profile-section">
                <div class="profile-section__profile">
                    <div class="profile-section__profile--avatar"></div>
                    <div class="profile-section__profile--info">
                        <div>nickname</div>
                        <div>status_message here</div>
                    </div>
                </div>
                <div class="profile-section__friends">
                    <div class="profile-section__friends--block">
                        <div class="profile-section__friends--header">
                            <div>friends</div>
                            <button class="profile-section__friends--button">
                                <i class="bi bi-person-plus"></i>
                            </button>
                        </div>
                        <div class="profile-section__friends--list"></div>
                    </div>
                </div>
            </section>
            <section class="main-section">
                <nav class="main-section__nav">
                    <ul class="main-section__list">
                        <li class="main-section__list--item active">home</li>
                        <li class="main-section__list--item">chat</li>
                        <li class="main-section__list--item">game</li>
                        <li class="main-section__list--item">rank</li>
                    </ul>
                </nav>
                <main class="main-section__main"></main>
            </section>
        </div>
        <div class="modal"></div>
	    `;
	}
}

export default new LoginSuccess();