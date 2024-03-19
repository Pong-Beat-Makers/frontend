import {renderMainPage} from "./Login/loginUtils.js";
import Player, {USER_STATUS} from "./Login/player.js";
import {getCookie} from '../src/Public/cookieUtils.js';

export let chatSocket;

const app = async () => {
    const token = getCookie("access_token");

    if (token) {
        const player = new Player(token);
        await player.whoAmI();
        await player.getFriendList();

        renderMainPage(player);
    } else {
        renderMainPage();
    }
}

await app();