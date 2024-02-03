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
		<div class="main_welcome">Chatting page!</div>
		<div class="main_body">
			<ul class="main_list">
				<li class="main_list_item">Rules of Pong</li>
				<li class="main_list_item">How to play</li>
				<li class="main_list_item">How to chat</li>
				<li class="main_list_item">Tournament</li>
			</ul>
		</div>
		<footer>
			<div class="footer_name">Team 42tsc</div>
			<ul class="footer_list">
				<li class="footer_list_item">hyeslim</li>
				<li class="footer_list_item">youngmch</li>
				<li class="footer_list_item">isunwoo</li>
				<li class="footer_list_item">naki</li>
				<li class="footer_list_item">jeelee</li>
			</ul>
			<div class="contacts">contacts: </div>
		</footer>
		`;
	}
}
export default new Chat();

window.addEventListener("click", handleClick);