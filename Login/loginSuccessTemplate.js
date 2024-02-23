class LoginSuccess {
	template() {
		return `
            <div id="container">
            <header>
                <div class="header_item">
                    <div class="logo_img"></div>
                    <div class="logo_name">42tsc_Pong 🏓</div>
                </div>
                <div class="header_item">
                    <button class="logoutBtn">Logout</button>
                </div>
            </header>
            <div class="wrapper">
                <section>
                    <div class="profile big"></div>
                    <div class="profile_info">
                        <div class="profile_info_name">hyeslim</div>
                        <div>
                            <div class="profile_info_description">Set your chat token : </div>
                            <input id="user-token-input" type="text" size="10" placeholder="token">
                            <input class="user-token-submit" type="button" value="Set">
                        </div>
                    </div>
                    <div class="friends_box">
                        <div class="friend_header">friends</div>
                        <div class="friend_box">
                            <div class="friend_info">
                                <div class="profile bord_one"></div>
                                <div class="friend_box_name">hyeslim</div>
                            </div>
                            <div class="friend_status">
                                <div class="friend_status_msg __online">online</div>
                                <div class="friend_status_dot __online_dot"></div>
                            </div>
                        </div>
                        <div class="friend_box">
                            <div class="friend_info">
                                <div class="profile bord_one"></div>
                                <div class="friend_box_name">isunwoo</div>
                            </div>
                            <div class="friend_status">
                                <div class="friend_status_msg __online">online</div>
                                <div class="friend_status_dot __online_dot"></div>
                            </div>
                        </div>
                        <div class="friend_box">
                            <div class="friend_info">
                                <div class="profile bord_one"></div>
                                <div class="friend_box_name">jeelee</div>
                            </div>
                            <div class="friend_status">
                                <div class="friend_status_msg __ingame">in game</div>
                                <div class="friend_status_dot __ingame_dot"></div>
                            </div>
                        </div>
                        <div class="friend_box">
                            <div class="friend_info">
                                <div class="profile bord_one"></div>
                                <div class="friend_box_name">naki</div>
                            </div>
                            <div class="friend_status">
                                <div class="friend_status_msg __offline">offline</div>
                                <div class="friend_status_dot __offline_dot"></div>
                            </div>
                        </div>
                        <div class="friend_box">
                            <div class="friend_info">
                                <div class="profile bord_one"></div>
                                <div class="friend_box_name">youngmch</div>
                            </div>
                            <div class="friend_status">
                                <div class="friend_status_msg __offline">offline</div>
                                <div class="friend_status_dot __offline_dot"></div>
                            </div>
                        </div>
                        <div class="friend_box_add">
                            Add a friend
                        </div>
                    </div>
                </section>
                <main class="main">
                    <div class="main_header_bar">
                        <button class="main_header_bar__tab homeBtn __tab_active">Home</button>
                        <button class="main_header_bar__tab chatBtn">Chat</button>
                        <button class="main_header_bar__tab gameBtn">Game</button>
                        <button class="main_header_bar__tab rankBtn">Rank</button>
                    </div>
                    <div class="main_welcome">Welcome to 42tsc_Pong!</div>
                    <div class="main_body">
                        <button class="open_modal_btn">Rules of Pong 🏓</button>
                        <div class="modal">
                            <div class="modal_content">
                                <button class="close_modal_btn">❌</button>
                                <h2>Rules of Pong 🏓</h2>
                                <p>모달창 내용</p>
                            </div>
                        </div>
                        <button class="open_modal_btn">How to play 🤹🏻‍♀️</button>
                        <div class="modal">
                            <div class="modal_content">
                                <button class="close_modal_btn">❌</button>
                                <h2>How to play 🤹🏻‍♀️</h2>
                                <p>모달창 내용</p>
                            </div>
                        </div>
                        <button class="open_modal_btn">How to chat 💬</button>
                        <div class="modal">
                            <div class="modal_content">
                                <button class="close_modal_btn">❌</button>
                                <h2>How to chat 💬</h2>
                                <p>모달창 내용</p>
                            </div>
                        </div>
                        <button class="open_modal_btn">Tournament 🏟️</button>
                        <div class="modal">
                            <div class="modal_content">
                                <button class="close_modal_btn">❌</button>
                                <h2>Tournament 🏟️</h2>
                                <p>모달창 내용</p>
                            </div>
                        </div>
                    </div>
                    <footer>
                        <div class="footer">Made by: @hyeslim @isunwoo @jeelee @naki @youngmch</div>
                    </footer>
                </main>
            </div>
        </div>
		`;
	}
}

export default new LoginSuccess();