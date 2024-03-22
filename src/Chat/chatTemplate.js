class Chat {
    alertTemplate(name, msg, time) {
        return `
            <div class="header__logout--btn">
                <div class="chat__room--contents">
                    <div class="chat__room--name">${name}</div>
                    <div class="chat__room--msg">${msg}</div>
                </div>
                <div class="chat__room--time">${time}</div>
            </div>
        `;
    }

    chatBoxTemplate(type, message, time) {
        return `
            <div class="chatbox ${type}">
                <div class="chatbox__message">${message}</div>
                <div class="chatbox__info">${time}</div>
            </div>
        `;
    }

    chatRoomTemplate(name, msg, time) {
        return `
        <div class="chat__room" role="button">
            <div class="chat__empty"></div>
            <div class="chat__room--profile"></div>
            <div class="chat__room--contents">
                <div class="chat__room--name">${name}</div>
                <div class="chat__room--msg">${msg}</div>
            </div>
            <div class="chat__room--info">
                <div class="chat__room--no-alert"></div>
                <div class="chat__room--time">${time}</div>
            </div>
        </div>
        `;
    }

    template() {
        return `
		<form class="chat__search">
			<input id="chat__search--input" type="text" placeholder="type nickname here..."/>
			<button class="chat__search--btn">
			    <i class="bi bi-search"></i>
			    search
            </button>
		</form>
		    <div class="chat__room--list"></div>
        </div>
		`;
    }

	modalTemplate() {
		return `
            <div class="modal__background"></div>
            <div class="chat__container">
                <div class="chat__header">
                    <div class="chat__header--profile">
                        <div class="chat__header--avatar"></div>
                        <div class="chat__header--name">friend</div>
                    </div>
                    <div class="chat__header--controlls">
                        <button class="chat__header--btn">
                            <i class="bi bi-controller"></i>
                            invite
                        </button>
                        <button class="chat__header--btn block">
                            <i class="bi bi-person-slash"></i>
                            Block
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