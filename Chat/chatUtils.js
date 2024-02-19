import { chatSocket } from "../profileUtils.js";

export const localhost = "localhost:8000";

// 심각한 문제 ! ! ㅎㅎ 1002가 1001로 보내는 메시지만 안보내짐,, 차단이 . . 아마 안됐을텐데 왜이러는걸까

/*
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
    searchName = '';
	if (searchName === "")
		searchResult.innerHTML = `<div>original</div>`
}
*/

export function handleSubmit(event) {
	event.preventDefault();
	const tokenInput = document.querySelector("#chatRoomSearch input").value;

    chatSocket.send(JSON.stringify({
        'target_nickname' : `${tokenInput}_test_id`,
        'message': `${localStorage.getItem("token")} has successfully connected to ${tokenInput}`
    }));
    // 모달 띄울 때 내부 토큰 정함
    document.querySelector('#target-token-input').innerHTML = tokenInput;

    // 이미 차단된 사람인지 체크 => 내부 창 block 버튼 unblock으로 바꾸기 위해
    fetch(`${localhost}/blockedusers/`)
    .then((response) => {
        if (!response.ok)
            throw new Error(`Error : ${response.status}`);
        return  response.json();
    })
    .then((data) => {
        if (data.block_requested === true)
            document.querySelector(".block_toggle_btn").innerHTML = "Unblock";
    });

    document.querySelector(".chat_modal").style.display = "block";
    document.querySelector("#chatRoomSearch input").value = '';
}

// 지금 해야하는 것 : 채팅목록에서 채팅방 누르면 채팅창 하나를 띄우되,
// 밖에서 어떤 값을 입력했냐에 따라 내부의 타겟 토큰이 하나로 정해져있고, 그 사람을 블락토글 할 수 있도록 하기
// 로그는 추후 수정

export function handleChatModal() {
	const chatModal = document.querySelector(".chat_modal");
    const openModalBtn = document.getElementsByClassName("chatroom");
    const closeModalBtn = document.querySelector(".close_chatroom_btn");
    const blockToggleBtn = document.querySelector(".block_toggle_btn");
    
    for (let i = 0; i < openModalBtn.length; i++) {
        openModalBtn[i].onclick = function() {
            chatModal.style.display = "block";
        }
    }
	closeModalBtn.onclick = function() {
		chatModal.style.display = "none";
	}
	blockToggleBtn.onclick = function() {
        const targetToken = document.querySelector('#target-token-input').innerHTML;
        let obj;

        if (blockToggleBtn.innerHTML === "Block") {
            obj = {
                'target_nickname' : `${targetToken}_test_id`,
                'block_requested' : true
            };
            blockToggleBtn.innerHTML = "Unblock";
        }
        else if (blockToggleBtn.innerHTML === "Unblock") {
            obj = {
                'target_nickname' : `${targetToken}_test_id`,
                'block_requested' : false
            };
            blockToggleBtn.innerHTML = "Block";
        }

        const data = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        };
        
        fetch(`${localhost}/blockedusers/`, data); // 예외처리 필요
	}
}

export function initChatSocket() {
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        document.querySelector('#chat-log').value += (data.from + ' : ');
        document.querySelector('#chat-log').value += (data.message + '\n');
        console.dir(data);
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
        const targetToken = document.querySelector('#target-token-input').innerHTML;
        const obj = {
            'target_nickname' : `${targetToken}_test_id`,
            'message': message
        };
        chatSocket.send(JSON.stringify(obj));
        console.dir(obj);
        messageInputDom.value = '';
    };
}

// const chatroomSearchForm = document.getElementById("chatRoomSearch");
// chatroomSearchForm.addEventListener("submit", handleSearchSubmit);