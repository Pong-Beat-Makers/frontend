class FriendModal {
    template() {
        return `
<div class="modal__container modal-name__friend-profile">
    <div class="modal__background"></div>
    <div class="friend-modal__container">
        <div class="friend-modal__wrapper">
            <div class="friend-modal__box">
                <div class="friend-modal__avator"></div>
                <div class="friend-modal__info">
                    <div class="friend-modal__info--nickname">friend name</div>
                    <div class="friend-modal__info--status">status_message here</div>
                </div>
            </div>
            <div class="friend-modal__box">
                <div class="friend-modal__game-info">
                    <div class="friend-modal__game-info--rate">Win rate<span>30%</span></div>
                    <div class="friend-modal__game-info--rank">Rank<span>3rd</span></div>
                </div>
                <div class="friend-modal__controll">
                    <button class="friend-modal__btn">
                        <i class="bi bi-chat-dots"></i>
                        chat
                    </button>
                    <button class="friend-modal__btn">
                        <i class="bi bi-person-plus"></i>
                        add
                    </button>
                </div>
            </div>
        </div>
        <div class="friend-modal__wrapper">
            <div class="friend-modal__header">Match history</div>
            <div class="friend-modal__history-list">
                <div class="friend-modal__history-item">
                    <div class="history-item__day">24/01/26</div>
                    <div class="history-item__profiles">
                        <div class="history-item__profiles--avator match-my-avator"></div>
                        <div>vs</div>
                        <div class="history-item__profiles--avator match-your-avator"></div>
                    </div>
                    <div class="history-item__score">Score 7 : 3</div>
                    <div class="history-item__status">Win</div>
                </div>
                <div class="friend-modal__history-item">
                    <div class="history-item__day">24/01/26</div>
                    <div class="history-item__profiles">
                        <div class="history-item__profiles--avator match-my-avator"></div>
                        <div>vs</div>
                        <div class="history-item__profiles--avator match-your-avator"></div>
                    </div>
                    <div class="history-item__score">Score 7 : 3</div>
                    <div class="history-item__status">Win</div>
                </div>
            </div>
        </div>
    </div>
</div>
        `;
    }
}

export default new FriendModal();