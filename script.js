let flashcards = [];
let currentFlashcardIndex = 0;
let isShowingAnswer = false;

async function generateFlashcards() {
    const notes = document.getElementById('notesInput').value.trim();
    const fileInput = document.getElementById('pdfUpload');
    const numFlashcards = document.getElementById('numFlashcards').value;
    const requiredTerms = document.getElementById('requiredTerms').value;

    let formData = new FormData();

    if (notes) {
        formData.append('text', notes);
    }

    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }

    if (!notes && fileInput.files.length === 0) {
        alert('Please enter some notes or upload a PDF file.');
        return;
    }

    formData.append('num_flashcards', numFlashcards);
    formData.append('required_terms', requiredTerms);

    try {
        const response = await fetch('http://127.0.0.1:5000/generate-flashcards', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            alert('Failed to generate flashcards. Please try again.');
            return;
        }

        const data = await response.json();
        flashcards = data.flashcards;

        startFlashcards();

        document.getElementById('pdfUpload').value = "";
    } catch (e) {
        alert('Failed to parse the response. Ensure the notes are suitable.');
    }
}

function startFlashcards() {
    if (!Array.isArray(Object.keys(flashcards))) {
        alert('No valid flashcards were generated.');
        return;
    }

    currentFlashcardIndex = 0;
    document.getElementById('flashcardContainer').classList.remove('hidden');
    showFlashcard();
}

function showFlashcard() {
    const keys = Object.keys(flashcards);
    const key = keys[currentFlashcardIndex];
    const value = flashcards[key];
    const isAnswerFirst = document.getElementById('orderToggle').checked;

    if (isAnswerFirst) {
        document.getElementById('flashcardContent').textContent = `${value}`;
        isShowingAnswer = false;
    } else {
        document.getElementById('flashcardContent').textContent = `${key}`;
        isShowingAnswer = false;
    }

    document.getElementById('flashcard').onclick = function () {
        const display = isShowingAnswer ? (isAnswerFirst ? `${value}` : `${key}`) : (isAnswerFirst ? `${key}` : `${value}`);
        document.getElementById('flashcardContent').textContent = display;
        isShowingAnswer = !isShowingAnswer;
    };
}

function showNextFlashcard() {
    const keys = Object.keys(flashcards);

    if (currentFlashcardIndex < keys.length-1) {
        currentFlashcardIndex++;
        showFlashcard();
    } else {
        alert('You have reached the end of the deck!');
    }
}

function showPreviousFlashcard() {
    if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        showFlashcard();
    } else {
        alert('You are already on the first flashcard!');
    }
}
