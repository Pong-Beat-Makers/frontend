import Home from "./Home/homeTemplate.js";
import Chat from "./Chat/chatTemplate.js";
import Game from "./Game/gameTemplate.js";
import Rank from "./Rank/rankTemplate.js";
import Login from "./Login/loginTemplate.js";

const routes = {
    "/": Home,
    "/home": Home,
    "/login": Login,
	"/chat": Chat,
    "/game": Game,
    "/rank": Rank,
}

// main.innerHTML = routes["/"].template();

const changeUrl = (requestedUrl) => {
    const main = document.querySelector(".main");
    // history.pushState(null, null, requestedUrl);
    main.innerHTML = routes[requestedUrl].template();
}
export default changeUrl;

window.addEventListener("popstate", () => {
    changeUrl(window.location.pathname);
});