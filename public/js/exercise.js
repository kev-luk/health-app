const modal = document.querySelector('.modal')
const changeDateButton = document.querySelector('.change-date')
const closeModalBtn = document.querySelector('.close-btn');
const exerciseModal = document.querySelector('.exercise-modal')
const newExercise = document.querySelector('.new-exercise')
const closeExerciseModal = document.querySelector('.exercise-close')

function openModal(element = modal) {
    element.style.display = 'block';
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

newExercise.addEventListener('click', () => {
    openModal(exerciseModal)
})

closeModalBtn.addEventListener('click', () => {
    closeDateModal();
});

closeExerciseModal.addEventListener('click', () => {
    closeExercise()
})

window.addEventListener('click', (e) => {
    outsideClick(e);
});