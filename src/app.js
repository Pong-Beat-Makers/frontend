import {renderMainPage} from "./Login/loginUtils.js";
import Player from "./Login/player.js";
import {getCookie} from './Public/cookieUtils.js';

export const player = Player;

const app = async () => {
    const token = getCookie("access_token");

    if (token) {
        await player.whoAmI(token);
        await renderMainPage(player);
    } else {
        await renderMainPage();
    }
}

await app();