const alphabet = [
    { letter: 'A', word: 'Alpha' },
    { letter: 'B', word: 'Bravo' },
    { letter: 'C', word: 'Charlie' },
    { letter: 'D', word: 'Delta' },
    { letter: 'E', word: 'Echo' },
    { letter: 'F', word: 'Foxtrot' },
    { letter: 'G', word: 'Golf' },
    { letter: 'H', word: 'Hotel' },
    { letter: 'I', word: 'India' },
    { letter: 'J', word: 'Juliet' },
    { letter: 'K', word: 'Kilo' },
    { letter: 'L', word: 'Lima' },
    { letter: 'M', word: 'Mike' },
    { letter: 'N', word: 'November' },
    { letter: 'O', word: 'Oscar' },
    { letter: 'P', word: 'Papa' },
    { letter: 'Q', word: 'Quebec' },
    { letter: 'R', word: 'Romeo' },
    { letter: 'S', word: 'Sierra' },
    { letter: 'T', word: 'Tango' },
    { letter: 'U', word: 'Uniform' },
    { letter: 'V', word: 'Victor' },
    { letter: 'W', word: 'Whiskey' },
    { letter: 'X', word: 'X-ray' },
    { letter: 'Y', word: 'Yankee' },
    { letter: 'Z', word: 'Zulu' }
];

let currentIndex = 0;
let practiceIndex = 0;
let correctAnswers = 0;
let score = 0;
let streak = 0;

// DOM Elements
const learningMode = document.getElementById('learning-mode');
const practiceMode = document.getElementById('practice-mode');
const modeToggle = document.getElementById('mode-toggle');
const learnModeBtn = document.getElementById('learn-mode-btn');
const practiceModeBtn = document.getElementById('practice-mode-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const answerInput = document.getElementById('answer-input');
const checkBtn = document.getElementById('check-btn');
const skipBtn = document.getElementById('skip-btn');
const feedbackDiv = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const streakElement = document.getElementById('streak');

// Initialize the app
function updateLearningCard() {
    const letterElement = learningMode.querySelector('.letter');
    const wordElement = learningMode.querySelector('.word');
    letterElement.textContent = alphabet[currentIndex].letter;
    wordElement.textContent = alphabet[currentIndex].word;
}

function updatePracticeCard() {
    const letterElement = practiceMode.querySelector('.letter');
    letterElement.textContent = alphabet[practiceIndex].letter;
    answerInput.value = '';
}

function updateProgress() {
    const progressBar = document.querySelector('.progress-bar div');
    const progress = (correctAnswers / alphabet.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateScore(isCorrect) {
    if (isCorrect) {
        streak++;
        score += (1 + streak); // Base point + streak bonus
    } else {
        streak = 0;
    }
    scoreElement.textContent = score;
    streakElement.textContent = streak;
}

function showFeedback(isCorrect, correctAnswer) {
    feedbackDiv.textContent = isCorrect ? 
        'Correct! Well done!' : 
        `Incorrect. The correct answer is ${correctAnswer}`;
    feedbackDiv.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    if (isCorrect) {
        checkBtn.textContent = 'Next';
        skipBtn.classList.add('hidden');
        answerInput.disabled = true;
    } else {
        checkBtn.textContent = 'Try Again';
        skipBtn.classList.remove('hidden');
    }
}

function resetQuestion() {
    checkBtn.textContent = 'Check Answer';
    skipBtn.classList.add('hidden');
    answerInput.disabled = false;
    feedbackDiv.className = 'feedback';
    feedbackDiv.textContent = '';
    answerInput.value = '';
    answerInput.focus();
}

function moveToNextQuestion() {
    practiceIndex = Math.floor(Math.random() * alphabet.length);
    updatePracticeCard();
    resetQuestion();
}

// Event Listeners
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + alphabet.length) % alphabet.length;
    updateLearningCard();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % alphabet.length;
    updateLearningCard();
});

learnModeBtn.addEventListener('click', () => {
    learningMode.classList.remove('hidden');
    practiceMode.classList.add('hidden');
    learnModeBtn.classList.add('active');
    practiceModeBtn.classList.remove('active');
});

practiceModeBtn.addEventListener('click', () => {
    learningMode.classList.add('hidden');
    practiceMode.classList.remove('hidden');
    learnModeBtn.classList.remove('active');
    practiceModeBtn.classList.add('active');
    practiceIndex = Math.floor(Math.random() * alphabet.length);
    updatePracticeCard();
});

modeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        // Practice Mode
        learningMode.classList.add('hidden');
        practiceMode.classList.remove('hidden');
        practiceModeBtn.click(); // Trigger existing logic
    } else {
        // Learn Mode
        learningMode.classList.remove('hidden');
        practiceMode.classList.add('hidden');
        learnModeBtn.click(); // Trigger existing logic
    }
});

skipBtn.addEventListener('click', () => {
    streak = 0;
    streakElement.textContent = streak;
    moveToNextQuestion();
});

checkBtn.addEventListener('click', () => {
    if (checkBtn.textContent === 'Next') {
        moveToNextQuestion();
        return;
    }
    
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = alphabet[practiceIndex].word;
    const isCorrect = userAnswer === correctAnswer.toLowerCase();
    
    showFeedback(isCorrect, correctAnswer);
    updateScore(isCorrect);
    
    if (isCorrect) {
        correctAnswers++;
        updateProgress();
    }
});

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkBtn.click();
    }
});

// Create tooltip element
document.addEventListener('DOMContentLoaded', function() {
    const tooltipIcon = document.querySelector('.fa-info-circle');
    if (tooltipIcon) {
        const tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'tooltip-content';
        tooltipDiv.innerHTML = `
            <div class="tooltip-title">Scoring system</div>
            <div class="tooltip-body">
                • Correct answer: +1 point
                • Streak bonus: +1 point per correct answer in a row
                • Wrong answer: no points, streak resets
                • Skip: no points, streak resets
            </div>
        `;
        tooltipIcon.appendChild(tooltipDiv);
        tooltipIcon.removeAttribute('data-tooltip');
    }
});

// Initialize the app
updateLearningCard();
updateProgress();
