class Chat {
    chatbox(num) {
        let ret = '';
        for (let i = 0; i < num; ++i) {
            ret += `
                <div class="chatbox message_you">
                    <div class="chatbox__message">hi!</div>
                    <div class="chatbox__info">16:31</div>
                </div>
                <div class="chatbox message_me">
                    <div class="chatbox__message">hello!</div>
                    <div class="chatbox__info">19:18</div>
                </div>
            `;
        }
        return ret;
    }

	template() {
		return `
		<div class="chat__container">    
    <div class="chat__header">
        <div class="chat__header--profile">
            <div class="chat__header--avator"></div>
            <div class="chat__header--name">friend</div>
        </div>
        <div class="chat__header--controlls">
            <button class="chat__header--btn" >
                <i class="bi bi-controller"></i>
                invite
            </button>
            <button class="chat__header--btn" >
                <i class="bi bi-person-slash"></i>
                block
            </button>
        </div>
    </div>
    <div class="chat__body">
        <div class="chat__body--frame">
            ${this.chatbox(5)}
        </div>
        <div class="chat__body--controller">
            <div class="chat__controller--text">
                <textarea placeholder="type something.."></textarea>
            </div>
            <div class="chat__controller--btn">
                <button>
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