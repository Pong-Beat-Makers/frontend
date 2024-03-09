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

	playGameTemplate() {
		return `
		<div class="modal__container modal-name_play-game">
			<div class="playgame__wrapper">
				<div class="playgame__header">
					<div class="playgame__header--profile">
					<div class="playgame__header--avator"></div>
					<div class="playgame__header--name">Player1</div>
					</div><div class="playgame__header--profile">
					<div class="playgame__header--avator"></div>
					<div class="playgame__header--name">Player2</div>
					</div>
				</div>
				<div class="playgame__body">
					<div id="game_playground" tabindex="0"></div>
					<botton class="playgame__btn">
						<i class="bi bi-flag"></i>
						give up
					</botton>
				</div>
			</div>
		</div>
		`
	}

	matchModalTemplate() {
		return `
        <div class="modal__container modal-name__matching-game">
            <div class="modal__background"></div>
            <div class="matching-game__wrapper">
                Searching for a match ...
                <button class="matching-game__btn">
                    <i class="bi bi-x-square"></i>
                    cancel & exit
                </button>
            </div>
        </div>
        `;
	}
}

export default new Game();