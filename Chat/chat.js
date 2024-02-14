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
			<div class="chat_modal">
				<div class="chatroom_content">
					<button class="close_chatroom_btn">❌</button>
					<h2>Chat room</h2>
					<p>hi hi ㅋ</p>
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

window.addEventListener("click", handleClick);
window.addEventListener("submit", handleSubmit);

function handleSubmit(event) { // handle submit을 할 게 아니라 value를 시시각각 체크해서 결과를 보여줘야 할듯 ㅠㅠ .!!
	event.preventDefault(); // form이라면 어쨌든 필수
	const searchName = document.querySelector("#chatRoomSearch input").value;
	const nameAll = document.getElementsByClassName("chat_name");
	const searchResult = document.querySelector(".chatroom_list");
	for (let i = 0; i < nameAll.length; i++) {
		if (searchName === nameAll[i].innerHTML) {
			searchResult.innerHTML = `
			<div class="chatroom">
				<div class="empty"></div>
				<div class="profile ranker"></div>
				<div class="chat_contents">
					<div class="chat_name">naki</div>
					<div class="chat_msg">Hi Hi</div>
				</div>
				<div class="chat_time">오후 7시 16분</div>
			</div>
			`
			break;
		}
		if (i === nameAll.length - 1) {
			searchResult.innerHTML = `<div>No result found for ${searchName}</div>`
		}
	}
	if (searchName === "")
		searchResult.innerHTML = `<div>original</div>`
}

// const chatroomSearchForm = document.getElementById("chatRoomSearch");
// chatroomSearchForm.addEventListener("submit", handleSearchSubmit);