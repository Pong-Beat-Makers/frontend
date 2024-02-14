// 이전에는 버튼 클릭 시 실행되는 함수가 handleClick, onclick 두가지여서 안됐던듯 . . 내부에서 분기 후 해결 ㅠ
export function handleHomeModal() {
    const modals = document.getElementsByClassName("modal");
    const openModalBtns = document.getElementsByClassName("open_modal_btn");
    const closeModalBtns = document.getElementsByClassName("close_modal_btn");
    // 원하는 Modal 수만큼 Modal 함수를 호출해서 funcs 함수에 정의합니다.
    for(let i = 0; i < openModalBtns.length; i++) {
        openModalBtns[i].onclick = function() {
            modals[i].style.display = "block";
        };
        closeModalBtns[i].onclick = function() {
            modals[i].style.display = "none";
        };
    }
}