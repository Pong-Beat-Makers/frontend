import changeUrl from "../route.js";

class Login {
	template() {
		return `
		<div class="wrapper">
			<div class="item_one">
				42tsc_Pong logo
			</div>
			<div class="item_two">
				<div class="login_header">
					Login with
				</div>
				<div class="login_box">
					<div class="login_logo"></div>
					<div class="login_name">Google</div>
				</div>
				<div class="login_box">
					<div class="login_logo"></div>
					<div class="login_name">42 Network</div>
				</div>
			</div>
		</div>
		`;
	}
}
export default new Login();

// const greeting = document.querySelector("#greeting");
// const loginIdInput = loginForm.querySelector("input");
// const loginPwInput = document.getElementsByName("pw")[0];
//name으로 요소 찾는 다른 방법 없을까 ㅠ

// function loginSuccess(event) {
// 	event.preventDefault();
// 	const name = loginIdInput.value;
// 	loginIdInput.value = "";
// 	loginPwInput.value = "";
//     localStorage.setItem("name", name);
//     loginForm.classList.add("hidden");
//     greeting.innerText = `안녕하세요, ${name}님!`;
//     changeUrl("/home");
// }

// loginForm.addEventListener("submit", loginSuccess);