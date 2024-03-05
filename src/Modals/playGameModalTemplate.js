class PlayGameModal {
    template() {
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

    matchTemplate() {
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

export default new PlayGameModal();