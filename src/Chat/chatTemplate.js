class Chat {
    constructor() {
        // 멤버변수 정의 : 선언만 하고 추후 값을 할당할 경우 null을 할당해 둔다.
        this.chatBoxes = ``;
    }

    // chatbox(type, message, time) {
    //     return `
    //             <div class="chatbox ${type}">
    //                 <div class="chatbox__message">${message}</div>
    //                 <div class="chatbox__info">${time}</div>
    //             </div>
    //         `;
    // }

    chatbox(type, message, time) {
        this.chatBoxes += `
            <div class="chatbox ${type}">
                <div class="chatbox__message">${message}</div>
                <div class="chatbox__info">${time}</div>
            </div>
        `;
        // 아래 템플릿에서 해당 변수를 사용하긴 하지만, return 된 이후의 값은 업데이트가 되지 않음 ,,
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
					<div class="chat__room--name">naki</div>
					<div class="chat__room--msg">Hi Hi</div>
				</div>
				<div class="chat__room--time">오후 7시 16분</div>
			</div>
			<div class="chat__room" role="button">
				<div class="chat__empty"></div>
				<div class="chat__room--profile"></div>
				<div class="chat__room--contents">
					<div class="chat__room--name">jeelee</div>
					<div class="chat__room--msg">hello world</div>
				</div>
				<div class="chat__room--time">오후 7시 17분</div>
			</div>
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