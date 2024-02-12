import Home from "./Home/home.js";
import Chat from "./Chat/chat.js";
import Game from "./Game/game.js";
import Rank from "./Rank/rank.js";
import Login from "./Login/login.js";

const main = document.querySelector(".main");
// const appContents = document.querySelector(".appContents");
// const loginForm = document.querySelector("#loginForm");
// const greeting = document.querySelector("#greeting");

const routes = {
	"/": Home,
    "/home": Home,
    "/login": Login,
	"/chat": Chat,
    "/game": Game,
    "/rank": Rank,
}

// 초기 화면 설정
main.innerHTML = routes["/"].template();
// appContents.innerHTML = routes["/"].templateContents();

const changeUrl = (requestedUrl) => {
	history.pushState(null, null, requestedUrl);
    // history.pushState API를 활용하여 페이지를 다시 로드하지 않고 URL을 탐색 할 수 있다.
	main.innerHTML = routes[requestedUrl].template();
    // appContents.innerHTML = routes[requestedUrl].templateContents();
}
export default changeUrl;

window.addEventListener("popstate", () => {
    changeUrl(window.location.pathname);
});

/*
if (localStorage.getItem("name") && localStorage.getItem("name") !== "") {
    loginForm.classList.add("hidden");
    greeting.innerText = `안녕하세요, ${localStorage.getItem("name")}님!`;
    changeUrl("/home");
}
*/