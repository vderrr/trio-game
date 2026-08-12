let score = 0;
let timer = 0;
let interval = null;
let isTimeUp = false;
let activeCategories = [];
let activeActions = [];
let playedWords = []; 

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const timeoutScreen = document.getElementById('timeout-screen');
const categoriesContainer = document.getElementById('categories-container');
const timerDisplay = document.getElementById('timer-display');
const scoreDisplay = document.getElementById('score-display');
const totalScoreDisplay = document.getElementById('total-score-display');

function initCategories() {
    categoriesContainer.innerHTML = '';
    for (const category in wordsData) {
        const label = document.createElement('label');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = category;
        checkbox.checked = true;
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + category));
        categoriesContainer.appendChild(label);
    }
}

document.getElementById('start-btn').addEventListener('click', () => {
    const catCheckboxes = document.querySelectorAll('#categories-container input:checked');
    activeCategories = Array.from(catCheckboxes).map(cb => cb.value);
    
    const actCheckboxes = document.querySelectorAll('#actions-container input:checked');
    activeActions = Array.from(actCheckboxes).map(cb => cb.value);

    if (activeCategories.length === 0) {
        alert('Обери хоча б одну категорію!');
        return;
    }
    if (activeActions.length === 0) {
        alert('Обери хоча б один спосіб пояснення!');
        return;
    }

    timer = parseInt(document.getElementById('round-time').value) || 60;
    isTimeUp = false;

    scoreDisplay.innerText = score;
    timerDisplay.innerText = timer;
    timerDisplay.style.color = '#333';

    setupScreen.classList.remove('active');
    setupScreen.classList.add('hidden');
    
    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('active');

    nextWord();
    startTimer();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    if(confirm("Точно завершити гру і скинути рахунок до нуля?")) {
        score = 0;
        totalScoreDisplay.innerText = score;
        playedWords = []; 
    }
});

function startTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerDisplay.innerText = timer;
        }
        if (timer === 0 && !isTimeUp) {
            isTimeUp = true;
            timerDisplay.innerText = "Час вийшов!";
            timerDisplay.style.color = "red";
        }
    }, 1000);
}

function nextWord() {
    // Збираємо слова ВРАЗОМ із їхньою категорією
    let availableWords = [];
    for (let category of activeCategories) {
        if (wordsData[category]) {
            wordsData[category].forEach(word => {
                availableWords.push({ word: word, category: category });
            });
        }
    }

    // Фільтруємо ті, які ще не випадали
    let unplayedWords = availableWords.filter(item => !playedWords.includes(item.word));

    // Якщо слова закінчилися, починаємо по колу
    if (unplayedWords.length === 0) {
        alert("Усі слова з обраних категорій вичерпано! Починаємо по колу.");
        playedWords = []; 
        unplayedWords = availableWords;
    }

    const randomItem = unplayedWords[Math.floor(Math.random() * unplayedWords.length)];
    const randomAction = activeActions[Math.floor(Math.random() * activeActions.length)];

    // Записуємо слово в історію, щоб не повторювалося
    playedWords.push(randomItem.word);

    // Виводимо категорію, слово та дію на екран
    document.getElementById('category-display').innerText = randomItem.category;
    document.getElementById('word-display').innerText = randomItem.word;
    document.getElementById('action-display').innerText = randomAction;
}

function handleTurnEnd(points) {
    score += points;
    scoreDisplay.innerText = score;

    if (isTimeUp) {
        gameScreen.classList.remove('active');
        gameScreen.classList.add('hidden');
        
        timeoutScreen.classList.remove('hidden');
        timeoutScreen.classList.add('active');
    } else {
        nextWord();
    }
}

document.getElementById('success-btn').addEventListener('click', () => handleTurnEnd(10));
document.getElementById('fail-btn').addEventListener('click', () => handleTurnEnd(-5));

document.getElementById('skip-btn').addEventListener('click', () => {
    if (!isTimeUp) {
        nextWord();
    }
});

document.getElementById('continue-btn').addEventListener('click', () => {
    timeoutScreen.classList.remove('active');
    timeoutScreen.classList.add('hidden');
    
    totalScoreDisplay.innerText = score;
    
    setupScreen.classList.remove('hidden');
    setupScreen.classList.add('active');
});

initCategories();