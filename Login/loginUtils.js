const localhost = "http://127.0.0.1:8000";
const loginBtns = document.getElementsByClassName("login_box");

function setUserInfo(site) {
    fetch(`${localhost}/accounts/${site}/login/`, {
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
        console.dir(data);
    });
}

loginBtns[0].onclick = setUserInfo("google");
loginBtns[1].onclick = setUserInfo("42intra");