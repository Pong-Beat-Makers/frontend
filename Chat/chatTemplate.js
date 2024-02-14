class Chat {
	template() {
		return `
		<div class="main_header_bar">
			<button class="main_header_bar__tab homeBtn">Home</button>
			<button class="main_header_bar__tab chatBtn __tab_active">Chat</button>
			<button class="main_header_bar__tab gameBtn">Game</button>
			<button class="main_header_bar__tab rankBtn">Rank</button>
		</div>
		<form id="chatRoomSearch">
			<input id="chatRoomSearchInput" type="text" placeholder="search"/>
			<button class="chatRoomSearchBtn">🔍</button>
		</form>
		<div class="chatroom_list">
			<div class="chat_modal">
				<div class="chatroom_content">
					<button class="close_chatroom_btn">❌</button>
					<textarea id="chat-log" cols="85" rows="20"></textarea>
					<div>
						<input id="chat-message-input" type="text" size="90">
						<input id="chat-message-submit" type="button" value="Send">
					</div>
				</div>
			</div>
			<div class="chatroom" role="button">
				<div class="empty"></div>
				<div class="profile ranker"></div>
				<div class="chat_contents">
					<div class="chat_name">naki</div>
					<div class="chat_msg">Hi Hi</div>
				</div>
				<div class="chat_time">오후 7시 16분</div>
			</div>
			<div class="chatroom" role="button">
				<div class="empty"></div>
				<div class="profile ranker"></div>
				<div class="chat_contents">
					<div class="chat_name">jeelee</div>
					<div class="chat_msg">hello world</div>
				</div>
				<div class="chat_time">오후 7시 17분</div>
			</div>
		</div>
		`;
	}
}

export default new Chat();