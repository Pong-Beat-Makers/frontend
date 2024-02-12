import changeUrl from "./route.js";

// export default : 한 파일에서 하나만 export
export default function handleClick(event)
{
    if (event.target.classList.contains("homeBtn")) {
		changeUrl("/home");
	} else if (event.target.classList.contains("chatBtn")) {
		changeUrl("/chat");
	} else if (event.target.classList.contains("gameBtn")) {
        changeUrl("/game");
    } else if (event.target.classList.contains("rankBtn")) {
        changeUrl("/rank");
    } else if (event.target.classList.contains("logoutBtn")) {
        changeUrl("/");
    }
}

const modals = document.getElementsByClassName("modal");
const openModalBtns = document.getElementsByClassName("open_modal_btn");
const closeModalBtns = document.getElementsByClassName("close_modal_btn");

// Modal을 띄우고 닫는 클릭 이벤트를 정의한 함수
function Modal(num) {
    return function() {
        openModalBtns[num].onclick =  function() {
            modals[num].style.display = "block";
        };
        closeModalBtns[num].onclick = function() {
            modals[num].style.display = "none";
        };
    };
}

// 원하는 Modal 수만큼 Modal 함수를 호출해서 funcs 함수에 정의합니다.
for(let i = 0; i < openModalBtns.length; i++) {
    Modal(i)();
}