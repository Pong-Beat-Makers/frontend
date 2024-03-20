import {renderMainPage} from "./Login/loginUtils.js";
import Player, {USER_STATUS} from "./Login/player.js";
import {getCookie} from '../src/Public/cookieUtils.js';

export const player = Player;

const app = async () => {
    const token = getCookie("access_token");

    if (token) {
        await player.whoAmI(token);
        await player.getFriendList();

        renderMainPage(player);
    } else {
        renderMainPage();
    }
}

await app();