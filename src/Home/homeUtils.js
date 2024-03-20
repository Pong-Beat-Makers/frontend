export function handleHomeModal() {
    const modals = document.getElementsByClassName("modal");
    const openModalBtns = document.getElementsByClassName("open_modal_btn");
    const closeModalBtns = document.getElementsByClassName("close_modal_btn");
    for(let i = 0; i < openModalBtns.length; i++) {
        openModalBtns[i].onclick = function() {
            modals[i].style.display = "block";
        };
        closeModalBtns[i].onclick = function() {
            modals[i].style.display = "none";
        };
    }
}