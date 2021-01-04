const modal = document.querySelector('.modal')
const changeDateButton = document.querySelector('.change-date')
const closeBtn = document.querySelector('.close-btn');

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}

changeDateButton.addEventListener('click', () => {
    openModal()
})

closeBtn.addEventListener('click', () => {
    closeModal();
});

window.addEventListener('click', (e) => {
    outsideClick(e);
});