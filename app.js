import changeUrl from "./route.js";
import { handleChatModal, initChatSocket, handleSubmit } from "./Chat/chatUtils.js";
import { handleHomeModal } from "./Home/homeUtils.js";

// export default : 한 파일에서 하나만 export
// 로그인에서 메인화면으로 넘어가면서 handleModal() 등록되게 하기
export default function handleClick(event)
{
    if (event.target.classList.contains("homeBtn" || "logoutBtn")) {
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
    } else if (event.target.classList.contains("open_modal_btn")) {
        handleHomeModal();
    }
}
window.addEventListener("click", handleClick);
window.addEventListener("submit", handleSubmit);