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
				<div class="rank first">1.</div>
				<div class="friend_info">
					<div class="profile first bord_one"></div>
					<div class="first">youngmch</div>
				</div>
				<div class="friend_status">
					<div class="friend_status_msg __online">online</div>
					<div class="friend_status_dot __online_dot"></div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank second">2.</div>
				<div class="friend_info">
					<div class="profile second bord_one"></div>
					<div class="second">youngmch</div>
				</div>
				<div class="friend_status">
					<div class="friend_status_msg __online">online</div>
					<div class="friend_status_dot __online_dot"></div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank third">3.</div>
				<div class="friend_info">
					<div class="profile third bord_one"></div>
					<div class="third">youngmch</div>
				</div>
				<div class="friend_status">
					<div class="friend_status_msg __ingame">in game</div>
					<div class="friend_status_dot __ingame_dot"></div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank mid">4.</div>
				<div class="friend_info">
					<div class="profile mid bord_one"></div>
					<div class="mid">youngmch</div>
				</div>
				<div class="friend_status">
					<div class="friend_status_msg __offline">offline</div>
					<div class="friend_status_dot __offline_dot"></div>
				</div>
			</div>
			<div class="ranker_box">
				<div class="rank mid">5.</div>
				<div class="friend_info">
					<div class="profile mid bord_one"></div>
					<div class="mid">youngmch</div>
				</div>
				<div class="friend_status">
					<div class="friend_status_msg __offline">offline</div>
					<div class="friend_status_dot __offline_dot"></div>
				</div>
			</div>
		</div>
		`;
	}
}
export default new Rank();

window.addEventListener("click", handleClick);