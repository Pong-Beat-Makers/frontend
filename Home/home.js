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
			<button class="open_modal_btn">Rules of Pong</button>
			<div class="modal">
				<div class="modal_content">
				<h2>Rules of Pong</h2>
				<p>모달창 내용</p>
				<button class="close_modal_btn">❌</button>
				</div>
			</div>
			<button class="open_modal_btn">How to play</button>
			<div class="modal">
				<div class="modal_content">
				<h2>How to play</h2>
				<p>모달창 내용</p>
				<button class="close_modal_btn">❌</button>
				</div>
			</div>
			<button class="open_modal_btn">How to chat</button>
			<div class="modal">
				<div class="modal_content">
				<h2>How to chat</h2>
				<p>모달창 내용</p>
				<button class="close_modal_btn">❌</button>
				</div>
			</div>
			<button class="open_modal_btn">Tournament</button>
			<div class="modal">
				<div class="modal_content">
				<h2>Tournament</h2>
				<p>모달창 내용</p>
				<button class="close_modal_btn">❌</button>
				</div>
			</div>
		</div>
		<footer>
			<div class="footer">Made by: @hyeslim @isunwoo @jeelee @naki @youngmch</div>
		</footer>
		`;
	}
}
export default new Home();

window.addEventListener("click", handleClick);