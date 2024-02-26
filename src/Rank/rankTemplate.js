class Rank {
	friend_profile(number) {
		let ret = '';
		for (let i = 0; i < number; ++i) ret += `
				<div class="rank__list--item">
						<div class="rank__list--number">${i+1}</div>
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
		return ret;
	}

	template() {
		return `
			<div class="rank__stage">
					<div class="rank__stage--table">
							<div class="rank__stage--avator rank__profile--silver"></div>
					</div>
					<div class="rank__stage--table">
							<div class="rank__stage--avator rank__profile--gold"></div>
					</div>
					<div class="rank__stage--table">
							<div class="rank__stage--avator rank__profile--bronze"></div>
					</div>
			</div>
			<div class="rank__list">
					<div class="rank__list--friends">
							${this.friend_profile(15)}
					</div>
			</div>
			`;
	}
}

export default new Rank();