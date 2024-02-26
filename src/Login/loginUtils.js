// import LoginSuccess from "./loginSuccessTemplate.js";

// const BACKEND = "http://127.0.0.1:8000";
// const loginBtns = document.getElementsByClassName("login_box");
// let loginStatus = false;

// function setUserInfo(site) {
//     fetch(`${BACKEND}/accounts/${site}/login/`, {
//         method: 'GET',
//     })
//     .then(response => {
//         if (!response.ok)
//             throw new Error(`Error : ${response.status}`);
//         // loginStatus = true;
//         return response.json();
//     })
//     .then(data => {
//         if (data.error)
//             return ;
//         console.dir(data);
//     });
//     loginStatus = true;
// }

// loginBtns[0].onclick = setUserInfo("google");
// loginBtns[1].onclick = setUserInfo("42intra");

// if (loginStatus === true) {
//     const body = document.querySelector(".body");
//     body.innerHTML = LoginSuccess.template();
// }