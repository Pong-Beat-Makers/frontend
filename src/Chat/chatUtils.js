import { BACKEND, FRONTEND } from "../Public/global.js";
import { routes } from "../route.js";
import { chatSocket } from "../app.js";

export function initChatSocket() {
    chatSocket.onopen = function (e) {
        chatSocket.send(JSON.stringify({
            'token' : localStorage.getItem("token"),
        }));
    };

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const chatFrame = document.querySelector(".chat__body--frame");
        if (data.from == `${localStorage.getItem("token")}_test_id`)
            chatFrame.innerHTML += routes["/chat"].chatBoxTemplate("message_me", data.message, "data.time");
        else
            chatFrame.innerHTML += routes["/chat"].chatBoxTemplate("message_you", data.message, "data.time");
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
}

window.addEventListener("submit", handleSubmit); // 이거 지금은 chat에서만 필요하긴 한디 .. 

// const chatroomSearchForm = document.getElementById("chatRoomSearch");
// chatroomSearchForm.addEventListener("submit", handleSearchSubmit);

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

/*
동작방식 : 채팅목록에서 채팅방 누르면 채팅창 하나를 띄우되, 
밖에서 어떤 값을 입력했냐에 따라 내부의 타겟 토큰이 하나로 정해져있고, 그 사람을 블락토글 할 수 있도록 하기
*/

function handleInvite() {
    const targetToken = document.querySelector(".chat__header--name").innerHTML;
    const roomAddress = `${FRONTEND}/game/${crypto.randomUUID()}`;

    chatSocket.send(JSON.stringify({
        'target_nickname' : `${targetToken}_test_id`,
        'message': `${localStorage.getItem("token")}_test_id invited you to a game!\n
        ${roomAddress}`
    }));
    // 추후 식별 가능 문자열로 바꿔서 이 메시지 받으면 게임 참여하기 버튼으로 바뀌게 하기 !

    window.location.href(roomAddress);
}

function handleBlockToggle() {
    const targetToken = document.querySelector(".chat__header--name").innerHTML;
    const blockToggleBtn = document.querySelectorAll(".chat__header--btn")[1];
    
    let methodSelected;

    if (blockToggleBtn.innerHTML === "Block") {
        blockToggleBtn.innerHTML = "Unblock";
        methodSelected = 'POST';
        chatSocket.send(JSON.stringify({
            'target_nickname' : `${targetToken}_test_id`,
            'message': `${targetToken}_test_id is now blocked by ${localStorage.getItem("token")}_test_id ❤️`
        }));
    }
    else if (blockToggleBtn.innerHTML === "Unblock") {
        blockToggleBtn.innerHTML = "Block";
        methodSelected = 'DELETE';
    }

    const data = {
      method: methodSelected,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        'target_nickname' : `${targetToken}_test_id`,
      })
    };
    
    fetch(`${BACKEND}/blockedusers/`, data); // 예외처리 필요
}

export function handleSubmit(event) {
    event.preventDefault();

	const tokenInput = document.querySelector('#chat__search--input').value;

    // 이미 차단된 사람인지 체크 => 내부 창 block 버튼 unblock으로 바꾸기 위해
    fetch(`${BACKEND}/blockedusers/?target_nickname=${tokenInput}_test_id`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then(response => {
        if (!response.ok)
            throw new Error(`Error : ${response.status}`);
        return  response.json();
    })
    .then(data => {
        if (data.is_blocked === true)
            document.querySelectorAll(".chat__header--btn")[0].innerHTML = "Unblock";
    });

    chatSocket.send(JSON.stringify({
        'target_nickname' : `${tokenInput}_test_id`,
        'message': `${localStorage.getItem("token")} has successfully connected to ${tokenInput}`
    }));

    // document.querySelector(".chat_modal").style.display = "block";
    // document.querySelector("#chat__search--input input").value = '';
    document.querySelector(".main-section__main").innerHTML = routes["/chat"].modalTemplate();
    document.querySelector(".chat__header--name").innerHTML = tokenInput;
    handleChatRoom();
}

export function handleChatModal() {
	// const chatModal = document.querySelector(".chat_modal");
    const openModalBtn = document.querySelectorAll(".chat__room");
    // const closeModalBtn = document.querySelector(".close_chatroom_btn");
    
    for (let i = 0; i < openModalBtn.length; i++) {
        openModalBtn[i].onclick = function() {
            // chatModal.style.display = "block";
            document.querySelector(".main-section__main").innerHTML = routes["/chat"].modalTemplate();
            // 모달 띄울 때 내부 토큰 정함
            document.querySelector(".chat__header--name").innerHTML = tokenInput;
            handleChatRoom();
        }
    }
	// closeModalBtn.onclick = function() {
	// 	chatModal.style.display = "none";
	// }
}

export function handleChatRoom() {
    const chatHeaderBtns = document.querySelectorAll(".chat__header--btn");
    chatHeaderBtns[0].onclick = handleInvite;
    chatHeaderBtns[1].onclick = handleBlockToggle;

    document.querySelector('.chat__controller--text').focus();
    document.querySelector('.chat__body--text').onkeydown = function(e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('.chat__controller--btn').click();
        }
    };

    document.querySelector('.chat__send--btn').onclick = function(e) {
        const messageInputDom = document.querySelector('.chat__body--text');
        const targetToken = document.querySelector('.chat__header--name').innerHTML;
        const message = messageInputDom.value;
        const obj = {
            'target_nickname' : `${targetToken}_test_id`,
            'message': message
        };
        chatSocket.send(JSON.stringify(obj));
        messageInputDom.value = '';
    };
}