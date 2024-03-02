import { BACKEND } from "../Public/global.js"
import ProfileModal from "../Modals/profileModalTemplate.js";

export function socialLogin(site) {
    fetch(`${BACKEND}/accounts/${site}/login/`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok)
            throw new Error(`Error : ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.error)
            return ;
        window.location.href = data.login_url;
    });
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function deleteCookieAll () {
    const cookies = document.cookie.split('; ');
    const expiration = 'Sat, 01 Jan 1972 00:00:00 GMT';
  
    for (i = 0; i < cookies.length; i++) {
        document.cookie = cookies[i].split('=')[0] + '=; expires=' + expiration;
    }
}

export function moveRefresh() {
    if (getCookie("refresh_token")) {
        const cookies = Object.fromEntries(
            document.cookie.split(';').map((cookie) => cookie.trim().split('=')),
        );
        localStorage.setItem("refresh_token", cookies["refresh_token"]);
        deleteCookie("refresh_token");
    }
}

export function handleEditUserUtils() {
    const profileBtn = document.querySelector('.profile-section__profile');

    profileBtn.addEventListener('click', () => {
        const modal = document.querySelector('.modal');

        modal.innerHTML += ProfileModal.template();

        document.querySelector('.modal__background').addEventListener('click', () => {
            const modalContainer = document.querySelector('.modal_profile');
            if (modalContainer !== undefined)  modalContainer.remove();
        });

        document.querySelectorAll('textarea').forEach(element => {
            element.addEventListener('keyup', e => {
                const textLenLimit = e.target.nextElementSibling.firstElementChild;

                textLenLimit.innerHTML = `${e.target.value.length}`;
            });
        });

        document.querySelectorAll('.profile-modal__avatorlist > .profile-modal__avator').forEach(element => {
            element.addEventListener('click', e => {
                e.target.classList.forEach(c => {
                    if (c.startsWith('image_')) {
                        document.querySelector('.profile-modal__big-avator').classList.remove()
                    }
                });
            });
        });
    })
}