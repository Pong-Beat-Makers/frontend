import changeUrl from "./route.js";

// export default : 한 파일에서 하나만 export
// 로그인에서 메인화면으로 넘어가면서 handleModal() 등록되게 하기
export default function handleClick(event)
{
    if (event.target.classList.contains("homeBtn")) {
        changeUrl("/home");
        handleModal();
	} else if (event.target.classList.contains("chatBtn")) {
		changeUrl("/chat");
        handleChat();
	} else if (event.target.classList.contains("gameBtn")) {
        changeUrl("/game");
        // handleGame();
    } else if (event.target.classList.contains("rankBtn")) {
        changeUrl("/rank");
        // handleRank();
    } else if (event.target.classList.contains("logoutBtn")) {
        changeUrl("/home");
        handleModal();
    } else if (event.target.classList.contains("open_modal_btn")) {
        handleModal();
    }
}

// 이전에는 버튼 클릭 시 실행되는 함수가 handleClick, onclick 두가지여서 안됐던듯 . . 내부에서 분기 후 해결 ㅠ
function handleModal() {
    const modals = document.getElementsByClassName("modal");
    const openModalBtns = document.getElementsByClassName("open_modal_btn");
    const closeModalBtns = document.getElementsByClassName("close_modal_btn");
    // 원하는 Modal 수만큼 Modal 함수를 호출해서 funcs 함수에 정의합니다.
    for(let i = 0; i < openModalBtns.length; i++) {
        openModalBtns[i].onclick = function() {
            modals[i].style.display = "block";
        };
        closeModalBtns[i].onclick = function() {
            modals[i].style.display = "none";
        };
    }
}

function handleChat() {
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