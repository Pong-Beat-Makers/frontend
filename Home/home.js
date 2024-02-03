import handleClick from "../app.js";

class Home {
	template() {
		return `
		<div class="main_header_bar">
			<button class="main_header_bar__tab homeBtn __tab_active">Home</button>
			<button class="main_header_bar__tab chatBtn">Chat</button>
			<button class="main_header_bar__tab gameBtn">Game</button>
			<button class="main_header_bar__tab rankBtn">Rank</button>
		</div>
		<div class="main_welcome">Welcome to 42tsc_Pong!</div>
		<div class="main_body">
			<ul class="main_list">
				<li class="main_list_item">Rules of Pong</li>
				<li class="main_list_item">How to play</li>
				<li class="main_list_item">How to chat</li>
				<li class="main_list_item">Tournament</li>
			</ul>
		</div>
		<footer>
			<div class="footer">Made by: @hyeslim @isunwoo @jeelee @naki @youngmch</div>
		</footer>
		`;
	}
}
export default new Home();

window.addEventListener("click", handleClick);