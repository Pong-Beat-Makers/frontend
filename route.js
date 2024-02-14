import Home from "./Home/home.js";
import Chat from "./Chat/chat.js";
import Game from "./Game/game.js";
import Rank from "./Rank/rank.js";
import Login from "./Login/login.js";

const routes = {
    "/": Home,
    "/home": Home,
    "/login": Login,
	"/chat": Chat,
    "/game": Game,
    "/rank": Rank,
}

const main = document.querySelector(".main");
main.innerHTML = routes["/"].template();

const changeUrl = (requestedUrl) => {
	// history.pushState(null, null, requestedUrl); 
    // history.pushState API를 활용하여 페이지를 다시 로드하지 않고 URL을 탐색 할 수 있다.
	// 근데 없어도 되는거였군아..
    main.innerHTML = routes[requestedUrl].template();
}
export default changeUrl;

window.addEventListener("popstate", () => {
    changeUrl(window.location.pathname);
});