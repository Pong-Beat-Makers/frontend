class Rank {
	rankerStageTemplate(tier) {
		return `
			<div class="rank__stage--table">
				<div class="rank__stage--avator rank__profile--${tier}"></div>
		</div>
		`
	}

	rankerTemplate() {
		return `
			<div class="rank__list--item">
				<div class="rank__list--number"></div>
				<div class="profile-section__friends--item">
						<div class="profile-section__friends--profile">
								<div></div>
								<div>friend</div>
						</div>
						<div class="profile-section__friends--status online">
								<div>online</div>
								<div></div>
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