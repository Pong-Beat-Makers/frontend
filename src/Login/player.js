import {changeTo2FAPage, getInfoJWT} from "./loginUtils.js";
import { BACKEND, USER_MANAGEMENT_DOMAIN } from "../Public/global.js";

export const USER_STATUS = {
    "DOSE_NOT_EXIST": 0,
    "NOT_AUTHORIZED": 1,
    "AUTHORIZED": 2
}

class Player {
    constructor() {
        this._status = USER_STATUS.DOSE_NOT_EXIST;
    }

    async whoAmI(token) {
        this._token = token;

        const { user_id, nickname } = getInfoJWT(this._token);
        this._id = user_id;
        this._nickName = nickname;

        const res = await this._getServer(`${BACKEND}/${USER_MANAGEMENT_DOMAIN}/profile/?friend=${nickname}`);
        if (res.status === 200) {
            this._status = USER_STATUS.AUTHORIZED;

            const {
                profile,
                status_message,
                win,
                lose,
                rank
            } = await res.json();

            this._profile = profile;
            this._status_message = status_message;
            this._win = win;
            this._lose = lose;
            this._rank = rank;
        } else if (res.status === 403) {
            this._status = USER_STATUS.NOT_AUTHORIZED;
        }
    }

    async send2FACode(code) {
        const { status } = await this._getServer(`${BACKEND}/${USER_MANAGEMENT_DOMAIN}/accounts/email_verification/?verification_code=${code}`);
        if (status === 200) {
            this._status = USER_STATUS.AUTHORIZED;
        }
        return status;
    }

    async getFriendList() {
        this._friendList = [];
        const res = await this._getServer(`${BACKEND}/${USER_MANAGEMENT_DOMAIN}/friends/`);
        if (res.status === 200) {
            const data = await res.json();
            for (let i = 0; i < data.length; i++) {
                // TODO: data 형식 확인 필요 !!
                this._friendList.push([data[i].pk, data[i].nickname, data[i].profile]);
            }
        }
        return this._friendList;
    }

    async _getServer(url, method = 'GET', bodyData) {
        let sendData = {
            method: method,
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        }
        if (bodyData) {
            sendData.body = JSON.stringify(bodyData);
        }
        return await fetch(url, sendData);
    }

    getId() {
        return this._id;
    }

    getNickName() {
        return this._nickName;
    }
    getProfile() {
        return this._profile;
    }
    getStatusMessage() {
        return this._status_message;
    }
    getWin() {
        return this._win;
    }
    getLose() {
        return this._lose;
    }
    getRank() {
        return this._rank;
    }
    getStatus() {
        return this._status;
    }
}

export default new Player();
