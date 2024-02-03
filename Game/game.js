import handleClick from "../app.js";

class Game {
	template() {
		return `
		<div class="main_header_bar">
			<button class="main_header_bar__tab homeBtn">Home</button>
			<button class="main_header_bar__tab chatBtn">Chat</button>
			<button class="main_header_bar__tab gameBtn __tab_active">Game</button>
			<button class="main_header_bar__tab rankBtn">Rank</button>
		</div>
		<div class="main_game">
			<button class="random_match">Random Match</button>
			<button class="tourna_match">Tournament</button>
		</div>
		`;
	}
}
export default new Game();

window.addEventListener("click", handleClick);