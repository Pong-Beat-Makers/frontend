export function handleRankModal() {
    const frendItems = document.querySelectorAll('.profile-section__friends--item');

    frendItems.forEach(item => {
        item.removeEventListener('click', friendModalClick, true);
        item.addEventListener('click', friendModalClick);
    });
}