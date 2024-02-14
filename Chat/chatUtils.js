export function handleSubmit(event) { // handle submit을 할 게 아니라 value를 시시각각 체크해서 결과를 보여줘야 할듯 ㅠㅠ .!!
	event.preventDefault(); // form이라면 어쨌든 필수
	const searchName = document.querySelector("#chatRoomSearch input").value;
	const nameAll = document.getElementsByClassName("chat_name");
	const searchResult = document.querySelector(".chatroom_list");
	for (let i = 0; i < nameAll.length; i++) {
		if (searchName === nameAll[i].innerHTML) {
			searchResult.innerHTML = `
			<div class="chatroom">
				<div class="empty"></div>
				<div class="profile ranker"></div>
				<div class="chat_contents">
					<div class="chat_name">naki</div>
					<div class="chat_msg">Hi Hi</div>
				</div>
				<div class="chat_time">오후 7시 16분</div>
			</div>
			`
			break;
		}
		if (i === nameAll.length - 1) {
			searchResult.innerHTML = `<div>No result found for ${searchName}</div>`
		}
	}
	if (searchName === "")
		searchResult.innerHTML = `<div>original</div>`
}


export function handleChatModal() {
	const chatModal = document.querySelector(".chat_modal");
    const openModalBtn = document.getElementsByClassName("chatroom");
    const closeModalBtn = document.querySelector(".close_chatroom_btn");

    for (let i = 0; i < openModalBtn.length; i++) {
        openModalBtn[i].onclick = function() {
            chatModal.style.display = "block";
        }
    }
	closeModalBtn.onclick = function() {
		chatModal.style.display = "none";
	}
}

export function initChatSocket() {
    const chatSocket = new WebSocket(
        'ws://'
        + "127.0.0.1"
        + ":8000"
        + '/ws/chatting/'
    );

    chatSocket.onopen = function (e) {
        chatSocket.send(JSON.stringify({
            'token' : '1002'
        }));
    }

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        document.querySelector('#chat-log').value += (data.message + '\n');
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-message-input').focus();
    document.querySelector('#chat-message-input').onkeyup = function(e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#chat-message-submit').click();
        }
    };

    document.querySelector('#chat-message-submit').onclick = function(e) {
        const messageInputDom = document.querySelector('#chat-message-input');
        const message = messageInputDom.value;
        chatSocket.send(JSON.stringify({
            'target_nickname' : "1001_test_id",
            'message': message
        }));
        messageInputDom.value = '';
    };
}

// const chatroomSearchForm = document.getElementById("chatRoomSearch");
// chatroomSearchForm.addEventListener("submit", handleSearchSubmit);