import handleClick from "../app.js";

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
			<div class="chatroom">
				<div class="empty"></div>
				<div class="profile second"></div>
				<div class="chat_contents">
					<div class="chat_name">naki</div>
					<div class="chat_msg">Hi Hi</div>
				</div>
				<div class="chat_time">오후 7시 16분</div>
			</div>
			<div class="chatroom">
				<div class="empty"></div>
				<div class="profile second"></div>
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

window.addEventListener("click", handleClick);
window.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
	event.preventDefault();
}

// const chatroomSearchForm = document.getElementById("chatRoomSearch");
// chatroomSearchForm.addEventListener("submit", handleSearchSubmit);