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
				<div class="rank_number">1.</div>
				<div class="rank_info">
					<div class="profile ranker"></div>
					<div class="ranker">hyeslim</div>
				</div>
				<div class="match_history">
					<div class="history">10 games 🏓</div>
					<div class="history">10 wins 😆</div>
					<div class="history">0 loses 😮‍💨</div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank_number">2.</div>
				<div class="rank_info">
					<div class="profile ranker"></div>
					<div class="ranker">isunwoo</div>
				</div>
				<div class="match_history">
					<div class="history">10 games 🏓</div>
					<div class="history">8 wins 😆</div>
					<div class="history">2 loses 😮‍💨</div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank_number">3.</div>
				<div class="rank_info">
					<div class="profile ranker"></div>
					<div class="ranker">jeelee</div>
				</div>
				<div class="match_history">
					<div class="history">10 games 🏓</div>
					<div class="history">6 wins 😆</div>
					<div class="history">4 loses 😮‍💨</div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank_number">4.</div>
				<div class="rank_info">
					<div class="profile ranker"></div>
					<div class="ranker">naki</div>
				</div>
				<div class="match_history">
					<div class="history">10 games 🏓</div>
					<div class="history">3 wins 😆</div>
					<div class="history">7 loses 😮‍💨</div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank_number">5.</div>
				<div class="rank_info">
					<div class="profile ranker"></div>
					<div class="ranker">youngmch</div>
				</div>
				<div class="match_history">
					<div class="history">10 games 🏓</div>
					<div class="history">1 wins 😆</div>
					<div class="history">9 loses 😮‍💨</div>
				</div>
			</div>
		</div>
		`;
	}
}
export default new Rank();

window.addEventListener("click", handleClick);