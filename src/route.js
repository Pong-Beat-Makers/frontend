import Home from "./Home/homeTemplate.js";
import Chat from "./Chat/chatTemplate.js";
import Game from "./Game/gameTemplate.js";
import Rank from "./Rank/rankTemplate.js";
import Login from "./Login/loginTemplate.js";

export const routes = {
    "/": Home,
    "/home": Home,
    "/login": Login,
	"/chat": Chat,
    "/game": Game,
    "/rank": Rank,
}

const changeUrl = (requestedUrl) => {
    const main = document.querySelector(".main-section__main");
    // history.pushState(null, null, requestedUrl);
    main.innerHTML = routes[requestedUrl].template();
    
    const headerElements = document.querySelectorAll(".main-section__list--item");
    headerElements.forEach(nav => {
        if (nav.classList.contains("active"))
            nav.classList.remove("active");
    });
}
export default changeUrl;

window.addEventListener("popstate", () => {
    changeUrl(window.location.pathname);
});