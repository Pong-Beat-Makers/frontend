import changeUrl from "./route.js";
import { handleChatModal, initChatSocket, handleSubmit } from "./Chat/chatUtils.js";
import { handleHomeModal } from "./Home/homeUtils.js";
import { updateProfile, resetProfile } from "./profileUtils.js";

// 로그인에서 메인화면으로 넘어가면서 handleModal() 등록되게 하기
export default function handleClick(event)
{
    if (event.target.classList.contains("homeBtn")) {
        changeUrl("/home");
        handleHomeModal();
	} else if (event.target.classList.contains("chatBtn")) {
		changeUrl("/chat");
        handleChatModal();
        initChatSocket();
	} else if (event.target.classList.contains("gameBtn")) {
        changeUrl("/game");
        // handleGame();
    } else if (event.target.classList.contains("rankBtn")) {
        changeUrl("/rank");
        // handleRank();
    } else if (event.target.classList.contains("user-token-submit")) {
        localStorage.setItem("token", document.querySelector('#user-token-input').value);
        updateProfile();
    } else if (event.target.classList.contains("logoutBtn")) {
        resetProfile();
        changeUrl("/home");
        handleHomeModal();
    }
}

if (localStorage.length > 0) {
    updateProfile();
}

window.addEventListener("click", handleClick);
window.addEventListener("submit", handleSubmit);
handleHomeModal(); // 로그인 화면 추가 시 지우기