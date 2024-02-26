class Game {
	template() {
		return `
		<div class="game__header">Select Match type</div>
		<div class="game__body">
				<div class="game__playbtn">
						<div class="game__playbtn--picture">
								<i class="bi bi-people"></i>
						</div>
						<div class="game__playbtn--text">2 Players</div>
				</div>
				<div class="game__playbtn">
						<div class="game__playbtn--picture">
								<i class="bi bi-lightning"></i>
						</div>
						<div class="game__playbtn--text">Random</div>
				</div>
				<div class="game__playbtn">
						<div class="game__playbtn--picture">
								<i class="bi bi-trophy"></i>
						</div>
						<div class="game__playbtn--text">Tournament</div>
				</div>
		</div>
		<div class="game__header">How to play 1:1 game with friend</div>
		<div class="game__body">
				<div class="game__manual">
						<div class="game__manual--text">1. Select a friend from the friends list</div>
						<div class="game__manual--picture"></div>
				</div>
				<div class="game__manual">
						<div class="game__manual--text">2. Click “Invite” button</div>
						<div class="game__manual--picture"></div>
				</div>
				<div class="game__manual">
						<div class="game__manual--text">3. Enjoy!</div>
						<div class="game__manual--picture"></div>
				</div>
		</div>
		`;
	}
}

export default new Game();