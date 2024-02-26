export let chatSocket;

export function updateProfile() {
    // const userTokenSubmit = document.querySelector('.user-token-submit');
    // const userTokenInputDom = document.querySelector('#user-token-input');
    // userTokenSubmit.classList.add("hidden");
    // userTokenInputDom.classList.add("hidden");
    // const profileInfo = document.querySelector('.profile_info_description');
    // profileInfo.innerHTML = `Your chat token : ${localStorage.getItem("token")}`

    // initChatSocket
    chatSocket = new WebSocket(
        'ws://'
        + "127.0.0.1"
        + ":8000"
        + '/ws/chatting/'
    );

    chatSocket.onopen = function (e) {
        chatSocket.send(JSON.stringify({
            'token' : localStorage.getItem("token"),
        }));
    }
}

export function resetProfile() {
    const userTokenSubmit = document.querySelector('.user-token-submit');
    const userTokenInputDom = document.querySelector('#user-token-input');
    userTokenSubmit.classList.remove("hidden");
    userTokenInputDom.classList.remove("hidden");
    const profileInfo = document.querySelector('.profile_info_description');
    profileInfo.innerHTML = `Set your chat token : `
    localStorage.clear();
}