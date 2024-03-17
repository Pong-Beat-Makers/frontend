export const GAME_TYPE = {
	TWO_PLAYER: 0,
	RANDOM: 1,
	TOURNAMENT: 2
}

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
		<div class="modal__container modal-name__play-game">
			<div class="modal__background"></div>
			<div class="modal__playgame--background"></div>
			<div class="playgame__wrapper">
				<div class="playgame__header">
					<div class="playgame__header--profile">
					<div class="playgame__header--avator"></div>
					<div class="playgame__header--name insert-playerName">Player1</div>
					</div><div class="playgame__header--profile">
					<div class="playgame__header--avator"></div>
					<div class="playgame__header--name insert-playerName">Player2</div>
					</div>
				</div>
				<div class="playgame__body">
					<div id="game_playground" tabindex="0"></div>
					<botton class="modal__btn playgame__btn">
						<i class="bi bi-flag"></i>
						give up
					</botton>
				</div>
			</div>
		</div>
		`
	}

	matchModalTemplate(type) {
		let comment = "Searching for a match .";
		let peoples = "";

		if (type === GAME_TYPE.TOURNAMENT) {
			comment = "Searching for a tournament .";
			peoples = `<div class="matching-game__status">
						(<span>1</span> / 4)
						</div>`;
		}
		return `
        <div class="modal__container modal-name__matching-game">
            <div class="modal__background"></div>
            <div class="matching-game__wrapper">
            	<span class="ingAnimation">${ comment }</span>
            	${ peoples }
                <button class="modal__btn matching-game__btn">
                    <i class="bi bi-x-square"></i>
                    cancel & exit
                </button>
            </div>
        </div>
        `;
	}

	versusModalTemplate() {
		return `
		<div class="modal__container modal-name__versus">
			<div class="modal__background"></div>
			<div class="modal__playgame--background"></div>
			<div class="versus-modal__wrapper">
				<div class="versus-modal__header">Get ready for the match!</div>
				<div class="versus-modal__body">
					<div class="versus-modal__profile">
						<div class="versus-modal__avator"></div>
						<div class="versus-modal__name insert-playerName">Player 1</div>
					</div>
					<div class="versus-modal__versus">vs</div>
					<div class="versus-modal__profile">
						<div class="versus-modal__avator"></div>
						<div class="versus-modal__name insert-playerName">Player 2</div>
					</div>
					<div class="board-modal__info"></div>
					<button class="modal__btn versus-modal__btn modal__ready-btn" disabled>
						<i class="bi bi-check-square"></i>
						ready
					</button>
				</div>
			</div>
		</div>
		`;
	}

	tournamentModalTemplate() {
		return `
		<div class="modal__container modal-name__tournament">
			<div class="modal__background"></div>
			<div class="modal__playgame--background"></div>
			<div class="tournament__wrapper">
				<div class="tournament__header">Knockout Rounds Bracket</div>
				<div class="tournament__body">
					<div class="tournament__layer">
						<div class="tournament__avator tournament__champion anonymous-avator"></div>
					</div>
					<div class="tournament__layer">
						<div class="tournament__versus">
							<div class="tournament__avator anonymous-avator"></div>
							<div class="tournament__avator anonymous-avator"></div>
						</div>
					</div>
					<div class="tournament__layer">
						<div class="tournament__versus">
							<div class="tournament__avator"></div>
							<div class="tournament__avator"></div>
						</div>
						<div class="tournament__versus">
							<div class="tournament__avator"></div>
							<div class="tournament__avator"></div>
						</div>
					</div>
					<div class="board-modal__info"></div>
					<button class="modal__btn tournament__btn modal__ready-btn" disabled>
						<i class="bi bi-check-square"></i>
						ready
					</button>
				</div>
			</div>
		</div>
		`;
	}
}

export default new Game();