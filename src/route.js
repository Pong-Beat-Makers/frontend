import Home from "./Home/homeTemplate.js";
import Chat from "./Chat/chatTemplate.js";
import Game from "./Game/gameTemplate.js";
import Rank from "./Rank/rankTemplate.js";
import Login from "./Login/loginTemplate.js";
import { setChatPage } from "./Chat/chatPageUtils.js";
import { handleHomeModal } from "./Home/homeUtils.js";
import { handleGameModal } from "./Game/gameUtils.js";
import { setRankPage } from "./Rank/rankUtils.js";

export const routes = {
    "/": Home,
    "/home": Home,
    "/login": Login,
	"/chat": Chat,
    "/game": Game,
    "/rank": Rank,
}

const changeUrl = (requestedUrl, doPush = true) => {
    const headerElements = app.querySelectorAll(".main-section__list--item");
    headerElements.forEach(nav => {
        if (nav.classList.contains("active"))
            nav.classList.remove("active");
    });

    const navi = ["/home", "/chat", "/game", "/rank"];
    headerElements[navi.indexOf(requestedUrl)].classList.add("active");

    const main = document.querySelector(".main-section__main");
    main.innerHTML = routes[requestedUrl].template();

    if (doPush)
        history.pushState(requestedUrl, null, requestedUrl);
}
export default changeUrl;

window.addEventListener("popstate", () => {
    const previousUrl = window.location.pathname;
    changeUrl(previousUrl, false);

    if (previousUrl === "/home")
        // handleHomeModal();
        ;
    else if (previousUrl === "/chat")
        setChatPage();
    else if (previousUrl === "/game")
        handleGameModal();
    else if (previousUrl === "/rank")
        setRankPage(document.querySelector(".app"));
});