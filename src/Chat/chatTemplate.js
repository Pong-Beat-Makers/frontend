class Chat {
    chatBoxTemplate(type, message, time) {
        return `
            <div class="chatbox ${type}">
                <div class="chatbox__message">${message}</div>
                <div class="chatbox__info">${time}</div>
            </div>
        `;
    }

    template() {
        return `
		<form id="chat__search">
			<input id="chat__search--input" type="text" placeholder="temporary token input"/>
			<button class="chat__search--btn">🔍</button>
		</form>
		<div class="chat__room--list">
			<div class="chat__room" role="button">
				<div class="chat__empty"></div>
				<div class="chat__room--profile"></div>
				<div class="chat__room--contents">
					<div class="chat__room--name">1001</div>
					<div class="chat__room--msg">Hi Hi</div>
				</div>
				<div class="chat__room--time">17:16</div>
			</div>
			<div class="chat__room" role="button">
				<div class="chat__empty"></div>
				<div class="chat__room--profile"></div>
				<div class="chat__room--contents">
					<div class="chat__room--name">1002</div>
					<div class="chat__room--msg">hello world</div>
				</div>
				<div class="chat__room--time">17:17</div>
			</div>
		</div>
        <div class="chat__modal">
        </div>
		`;
    }

	modalTemplate() {
		return `
		<div class="chat__container">
            <div class="chat__header">
                <div class="chat__header--profile">
                    <div class="chat__header--avator"></div>
                    <div class="chat__header--name">friend</div>
                </div>
                <div class="chat__header--controlls chat__header--invite">
                    <button class="chat__header--btn" >
                        <i class="bi bi-controller"></i>
                        invite
                    </button>
                    <button class="chat__header--btn chat__header--block" >
                        <i class="bi bi-person-slash"></i>
                        block
                    </button>
                </div>
            </div>
            <div class="chat__body">
                <div class="chat__body--frame">
                </div>
                <div class="chat__body--controller">
                    <div class="chat__controller--text">
                        <textarea class="chat__body--text" placeholder="type something.."></textarea>
                    </div>
                    <div class="chat__controller--btn">
                        <button class="chat__send--btn">
                            <i class="bi bi-send"></i>
                            send
                        </button>
                    </div>
                </div>
            </div>
        </div>
		`;
	}
}

export default new Chat();