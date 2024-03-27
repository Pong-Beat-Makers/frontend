class Rank {
	rankerTemplate(num, nickname) {
		return `
			<div class="rank__list--item">
				<div class="rank__list--number">${num}</div>
				<div class="profile-section__friends--item">
						<div class="profile-section__friends--profile">
							<div class="profile-section__friends--pic"></div>
							<div class="profile-section__friends--name">${nickname}</div>
						</div>
				</div>
			</div>
			`;
	}

	template() {
		return `
			<div class="rank__stage"></div>
			<div class="rank__list">
					<div class="rank__list--friends">
					</div>
			</div>
			`;
	}
}

export default new Rank();