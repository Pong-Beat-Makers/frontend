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
			<div>
				<textarea id="chat-log" cols="100" rows="20"></textarea><br>
				<input id="chat-message-input" type="text" size="100"><br>
				<input id="chat-message-submit" type="button" value="Send">
				{{ room_name|json_script:"room-name" }}
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

const roomName = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
	'ws://'
	+ window.location.host
	+ '/ws/chatting/'
	+ roomName
	+ '/'
);

chatSocket.onmessage = function(e) {
	const data = JSON.parse(e.data);
	document.querySelector('#chat-log').value += (data.message + '\n');
};

chatSocket.onclose = function(e) {
	console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
	if (e.keyCode === 13) {  // enter, return
		document.querySelector('#chat-message-submit').click();
	}
};

document.querySelector('#chat-message-submit').onclick = function(e) {
	const messageInputDom = document.querySelector('#chat-message-input');
	const message = messageInputDom.value;
	chatSocket.send(JSON.stringify({
		'message': message
	}));
	messageInputDom.value = '';
};