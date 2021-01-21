const modal = document.querySelector('.modal')
const changeDateButton = document.querySelector('.change-date')
const closeModalBtn = document.querySelector('.close-btn');
const exerciseModal = document.querySelector('.exercise-modal')
const newEntry = document.querySelector('.new-entry')
const closeExerciseModal = document.querySelector('.exercise-close')

function openModal(element = modal) {
    element.style.display = 'flex';
}

function closeDateModal() {
    modal.style.display = 'none'
}

function closeExercise() {
    exerciseModal.style.display = 'none';
}

function outsideClick(e) {
    if ((e.target == modal) || (e.target == exerciseModal)) {
        modal.style.display = 'none';
        exerciseModal.style.display = 'none'
    }
}

changeDateButton.addEventListener('click', () => {
    openModal()
})

if (document.body.contains(newEntry)) {
    newEntry.addEventListener('click', () => {
        openModal(exerciseModal)
    })
}

closeModalBtn.addEventListener('click', () => {
    closeDateModal();
});


if (document.body.contains(newEntry)) {
    closeExerciseModal.addEventListener('click', () => {
        closeExercise()
    })
}

window.addEventListener('click', (e) => {
    outsideClick(e);
});