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
    const modal = document.querySelector(".modal");
    if (event.target.classList.contains("open_modal_btn")) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // 스크롤바 제거
    } else if (event.target.classList.contains("close_modal_btn")) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // 스크롤바 제거
    }
}