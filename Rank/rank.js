import handleClick from "../app.js";

class Rank {
	template() {
		return `
		<div class="main_header_bar">
			<button class="main_header_bar__tab homeBtn">Home</button>
			<button class="main_header_bar__tab chatBtn">Chat</button>
			<button class="main_header_bar__tab gameBtn">Game</button>
			<button class="main_header_bar__tab rankBtn __tab_active">Rank</button>
		</div>
		<div class="main_welcome">Hall of Fame 🏆</div>
		<div class="rankers_box">
			<div class="ranker_box">
				<div class="rank_first">1.</div>
				<div class="rank_info">
					<div class="profile first bord_one"></div>
					<div class="first">youngmch</div>
				</div>
				<div class="match_history">
					<div class="history_big">10 games 🏓</div>
					<div class="history_big">10 wins 😆</div>
					<div class="history_big">0 loses 😮‍💨</div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank_second">2.</div>
				<div class="rank_info">
					<div class="profile second bord_one"></div>
					<div class="second">youngmch</div>
				</div>
				<div class="match_history">
					<div class="history_big">10 games 🏓</div>
					<div class="history_big">8 wins 😆</div>
					<div class="history_big">2 loses 😮‍💨</div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank_third">3.</div>
				<div class="rank_info">
					<div class="profile third bord_one"></div>
					<div class="third">youngmch</div>
				</div>
				<div class="match_history">
					<div class="history_big">10 games 🏓</div>
					<div class="history_big">6 wins 😆</div>
					<div class="history_big">4 loses 😮‍💨</div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="mid">4.</div>
				<div class="rank_info">
					<div class="profile mid bord_one"></div>
					<div class="mid">youngmch</div>
				</div>
				<div class="match_history">
					<div class="history_small">10 games 🏓</div>
					<div class="history_small">3 wins 😆</div>
					<div class="history_small">7 loses 😮‍💨</div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="mid">5.</div>
				<div class="rank_info">
					<div class="profile mid bord_one"></div>
					<div class="mid">youngmch</div>
				</div>
				<div class="match_history">
					<div class="history_small">10 games 🏓</div>
					<div class="history_small">1 wins 😆</div>
					<div class="history_small">9 loses 😮‍💨</div>
				</div>
			</div>
		</div>
		`;
	}
}
export default new Rank();

window.addEventListener("click", handleClick);