// Enhanced game.js - Improved game logic for Hangman Game

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = checkUserLoggedIn();
    
    // Initialize game elements
    initializeKeyboard();
    initializeHangmanDisplay();
    
    // Set up category selection
    setupCategories();
    
    // Add event listener for the "New Game" button
    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame);
    }
    
    // Start a new game when the page loads
    startNewGame();
    
    // Add keyboard event listener for physical keyboard
    document.addEventListener('keydown', function(event) {
        if (window.gameState && !window.gameState.isGameOver) {
            const key = event.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) {
                handleGuess(key);
            }
        }
    });
});

/**
 * Check if the user is logged in
 */
function checkUserLoggedIn() {
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    
    if (currentUser) {
        console.log('User is logged in:', JSON.parse(currentUser).username);
        return JSON.parse(currentUser);
    } else {
        console.log('User is not logged in');
        window.location.href = 'login.html';
        return null;
    }
}

/**
 * Initialize the virtual keyboard
 */
function initializeKeyboard() {
    const keyboard = document.getElementById('keyboard');
    
    // Clear any existing keyboard
    keyboard.innerHTML = '';
    
    // Define the keyboard layout
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];
    
    // Create keyboard layout
    keyboardRows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        
        row.forEach(letter => {
            const key = document.createElement('div');
            key.classList.add('key');
            key.textContent = letter;
            key.dataset.letter = letter;
            
            // Add event listener for key press
            key.addEventListener('click', function() {
                handleGuess(letter);
            });
            
            rowDiv.appendChild(key);
        });
        
        keyboard.appendChild(rowDiv);
    });
}

/**
 * Initialize the hangman display with SVG
 */
function initializeHangmanDisplay() {
    const hangmanDisplay = document.querySelector('.hangman-display');
    
    // Clear any existing content
    hangmanDisplay.innerHTML = '';
    
    // Create SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 300 300');
    svg.id = 'hangman-svg';
    
    // Add the gallows (always visible)
    // Base
    const base = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    base.setAttribute('x1', '50');
    base.setAttribute('y1', '250');
    base.setAttribute('x2', '250');
    base.setAttribute('y2', '250');
    base.setAttribute('stroke', '#333');
    base.setAttribute('stroke-width', '3');
    
    // Post
    const post = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    post.setAttribute('x1', '100');
    post.setAttribute('y1', '250');
    post.setAttribute('x2', '100');
    post.setAttribute('y2', '50');
    post.setAttribute('stroke', '#333');
    post.setAttribute('stroke-width', '3');
    
    // Top beam
    const beam = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    beam.setAttribute('x1', '100');
    beam.setAttribute('y1', '50');
    beam.setAttribute('x2', '200');
    beam.setAttribute('y2', '50');
    beam.setAttribute('stroke', '#333');
    beam.setAttribute('stroke-width', '3');
    
    // Rope
    const rope = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rope.setAttribute('x1', '200');
    rope.setAttribute('y1', '50');
    rope.setAttribute('x2', '200');
    rope.setAttribute('y2', '80');
    rope.setAttribute('stroke', '#333');
    rope.setAttribute('stroke-width', '2');
    rope.id = 'hangman-rope';
    rope.style.opacity = '0';
    
    // Add the hangman parts (initially hidden)
    // Head
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    head.setAttribute('cx', '200');
    head.setAttribute('cy', '100');
    head.setAttribute('r', '20');
    head.setAttribute('stroke', '#333');
    head.setAttribute('stroke-width', '2');
    head.setAttribute('fill', 'transparent');
    head.id = 'hangman-head';
    head.style.opacity = '0';
    
    // Body
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    body.setAttribute('x1', '200');
    body.setAttribute('y1', '120');
    body.setAttribute('x2', '200');
    body.setAttribute('y2', '180');
    body.setAttribute('stroke', '#333');
    body.setAttribute('stroke-width', '2');
    body.id = 'hangman-body';
    body.style.opacity = '0';
    
    // Left arm
    const leftArm = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    leftArm.setAttribute('x1', '200');
    leftArm.setAttribute('y1', '140');
    leftArm.setAttribute('x2', '170');
    leftArm.setAttribute('y2', '160');
    leftArm.setAttribute('stroke', '#333');
    leftArm.setAttribute('stroke-width', '2');
    leftArm.id = 'hangman-left-arm';
    leftArm.style.opacity = '0';
    
    // Right arm
    const rightArm = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rightArm.setAttribute('x1', '200');
    rightArm.setAttribute('y1', '140');
    rightArm.setAttribute('x2', '230');
    rightArm.setAttribute('y2', '160');
    rightArm.setAttribute('stroke', '#333');
    rightArm.setAttribute('stroke-width', '2');
    rightArm.id = 'hangman-right-arm';
    rightArm.style.opacity = '0';
    
    // Left leg
    const leftLeg = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    leftLeg.setAttribute('x1', '200');
    leftLeg.setAttribute('y1', '180');
    leftLeg.setAttribute('x2', '170');
    leftLeg.setAttribute('y2', '220');
    leftLeg.setAttribute('stroke', '#333');
    leftLeg.setAttribute('stroke-width', '2');
    leftLeg.id = 'hangman-left-leg';
    leftLeg.style.opacity = '0';
    
    // Right leg
    const rightLeg = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rightLeg.setAttribute('x1', '200');
    rightLeg.setAttribute('y1', '180');
    rightLeg.setAttribute('x2', '230');
    rightLeg.setAttribute('y2', '220');
    rightLeg.setAttribute('stroke', '#333');
    rightLeg.setAttribute('stroke-width', '2');
    rightLeg.id = 'hangman-right-leg';
    rightLeg.style.opacity = '0';
    
    // Append all elements to the SVG
    svg.appendChild(base);
    svg.appendChild(post);
    svg.appendChild(beam);
    svg.appendChild(rope);
    svg.appendChild(head);
    svg.appendChild(body);
    svg.appendChild(leftArm);
    svg.appendChild(rightArm);
    svg.appendChild(leftLeg);
    svg.appendChild(rightLeg);
    
    // Append the SVG to the hangman display
    hangmanDisplay.appendChild(svg);
}

/**
 * Setup word categories
 */
function setupCategories() {
    // Define word categories
    window.wordCategories = {
        programming: [
            'JAVASCRIPT', 'PYTHON', 'ALGORITHM', 'FUNCTION', 'VARIABLE',
            'DATABASE', 'FRAMEWORK', 'DEVELOPER', 'DEBUGGING', 'INTERFACE'
        ],
        animals: [
            'ELEPHANT', 'PENGUIN', 'LEOPARD', 'DOLPHIN', 'BUTTERFLY',
            'KANGAROO', 'GORILLA', 'OCTOPUS', 'CROCODILE', 'SQUIRREL'
        ],
        countries: [
            'AUSTRALIA', 'CANADA', 'GERMANY', 'BRAZIL', 'THAILAND',
            'MEXICO', 'SWEDEN', 'EGYPT', 'PORTUGAL', 'INDONESIA'
        ],
        fruits: [
            'WATERMELON', 'STRAWBERRY', 'PINEAPPLE', 'BLUEBERRY', 'APRICOT',
            'GRAPEFRUIT', 'RASPBERRY', 'POMEGRANATE', 'CRANBERRY', 'TANGERINE'
        ]
    };
    
    // Add category selection if it doesn't exist yet
    if (!document.getElementById('category-selector')) {
        const gameControls = document.querySelector('.game-controls');
        const newGameBtn = document.getElementById('new-game-btn');
        
        const categorySelector = document.createElement('div');
        categorySelector.classList.add('category-selector');
        categorySelector.innerHTML = `
            <label for="category">Select Category:</label>
            <select id="category-selector" class="category-dropdown">
                <option value="random">Random</option>
                <option value="programming">Programming</option>
                <option value="animals">Animals</option>
                <option value="countries">Countries</option>
                <option value="fruits">Fruits</option>
            </select>
        `;
        
        gameControls.insertBefore(categorySelector, newGameBtn);
    }
}

/**
 * Start a new game
 */
function startNewGame() {
    // Get selected category
    const categorySelector = document.getElementById('category-selector');
    let selectedCategory = 'random';
    
    if (categorySelector) {
        selectedCategory = categorySelector.value;
    }
    
    // Get a random word based on the selected category
    const word = getRandomWord(selectedCategory);
    
    // Setup the game
    setupGame(word);
    
    // Reset the hangman display
    resetHangmanDisplay();
    
    // Start the game timer
    startGameTimer();
    
    // Show category hint
    showCategoryHint(word, selectedCategory);
}

/**
 * Get a random word based on the selected category
 */
function getRandomWord(category) {
    if (category === 'random' || !window.wordCategories[category]) {
        // Select a random category if 'random' is chosen
        const categories = Object.keys(window.wordCategories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const wordList = window.wordCategories[randomCategory];
        return wordList[Math.floor(Math.random() * wordList.length)];
    } else {
        // Select a word from the chosen category
        const wordList = window.wordCategories[category];
        return wordList[Math.floor(Math.random() * wordList.length)];
    }
}

/**
 * Show hint about the word's category
 */
function showCategoryHint(word, selectedCategory) {
    // Find the actual category of the word
    let wordCategory = selectedCategory;
    
    if (selectedCategory === 'random') {
        // Find which category the word belongs to
        for (const category in window.wordCategories) {
            if (window.wordCategories[category].includes(word)) {
                wordCategory = category;
                break;
            }
        }
    }
    
    // Show hint
    const hintElement = document.querySelector('.category-hint') || document.createElement('div');
    hintElement.classList.add('category-hint');
    hintElement.textContent = `Hint: Word from "${wordCategory}" category`;
    
    // Add if it doesn't exist yet
    if (!document.querySelector('.category-hint')) {
        const wordDisplay = document.querySelector('.word-display');
        wordDisplay.parentNode.insertBefore(hintElement, wordDisplay);
    }
}

/**
 * Set up the game with a specific word
 */
function setupGame(word) {
    // Store game state
    window.gameState = {
        word: word,
        guessedLetters: [],
        remainingAttempts: 6,
        isGameOver: false,
        startTime: new Date().getTime()
    };
    
    // Reset keyboard
    resetKeyboard();
    
    // Reset attempts display
    document.getElementById('attempts').textContent = window.gameState.remainingAttempts;
    
    // Set up the word display
    const wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = '';
    
    for (let i = 0; i < word.length; i++) {
        const letterBox = document.createElement('div');
        letterBox.classList.add('letter-box');
        letterBox.dataset.index = i;
        wordDisplay.appendChild(letterBox);
    }
    
    // Add animation to the word display
    wordDisplay.classList.add('slide-in');
    setTimeout(() => {
        wordDisplay.classList.remove('slide-in');
    }, 1000);
}

/**
 * Reset the hangman display
 */
function resetHangmanDisplay() {
    const parts = [
        'hangman-rope',
        'hangman-head',
        'hangman-body',
        'hangman-left-arm',
        'hangman-right-arm',
        'hangman-left-leg',
        'hangman-right-leg'
    ];
    
    parts.forEach(partId => {
        const part = document.getElementById(partId);
        if (part) {
            part.style.opacity = '0';
            part.classList.remove('fade-in');
        }
    });
}

/**
 * Reset the keyboard appearance
 */
function resetKeyboard() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.classList.remove('correct', 'incorrect');
        key.style.pointerEvents = 'auto';
    });
}

/**
 * Start the game timer
 */
function startGameTimer() {
    // Clear existing timer
    if (window.gameTimer) {
        clearInterval(window.gameTimer);
    }
    
    // Create timer element if it doesn't exist
    if (!document.getElementById('game-timer')) {
        const timerElement = document.createElement('div');
        timerElement.id = 'game-timer';
        timerElement.classList.add('game-timer');
        timerElement.innerHTML = 'Time: <span id="timer-seconds">0</span>s';
        
        const gameControls = document.querySelector('.game-controls');
        gameControls.appendChild(timerElement);
    }
    
    // Reset timer display
    document.getElementById('timer-seconds').textContent = '0';
    
    // Start timer
    window.gameTimer = setInterval(() => {
        if (window.gameState && !window.gameState.isGameOver) {
            const elapsedSeconds = Math.floor((new Date().getTime() - window.gameState.startTime) / 1000);
            document.getElementById('timer-seconds').textContent = elapsedSeconds;
        } else {
            clearInterval(window.gameTimer);
        }
    }, 1000);
}

/**
 * Handle a letter guess
 */
function handleGuess(letter) {
    // If game is over, do nothing
    if (window.gameState.isGameOver) {
        return;
    }
    
    // If letter was already guessed, do nothing
    if (window.gameState.guessedLetters.includes(letter)) {
        return;
    }
    
    // Add letter to guessed letters
    window.gameState.guessedLetters.push(letter);
    
    // Check if the letter is in the word
    const isCorrectGuess = window.gameState.word.includes(letter);
    
    // Update keyboard appearance
    const key = document.querySelector(`.key[data-letter="${letter}"]`);
    if (isCorrectGuess) {
        key.classList.add('correct');
        // Play correct sound effect
        playSound('correct');
    } else {
        key.classList.add('incorrect');
        // Decrease remaining attempts
        window.gameState.remainingAttempts--;
        document.getElementById('attempts').textContent = window.gameState.remainingAttempts;
        
        // Update hangman display
        updateHangmanDisplay(window.gameState.remainingAttempts);
        
        // Play wrong sound effect
        playSound('wrong');
    }
    
    // Disable the key
    key.style.pointerEvents = 'none';
    
    // Update word display
    updateWordDisplay(letter, isCorrectGuess);
    
    // Check win/lose conditions
    checkGameStatus();
}

/**
 * Update the hangman display based on remaining attempts
 */
function updateHangmanDisplay(remainingAttempts) {
    const parts = [
        'hangman-rope',
        'hangman-head',
        'hangman-body',
        'hangman-left-arm',
        'hangman-right-arm',
        'hangman-left-leg',
        'hangman-right-leg'
    ];
    
    const partIndex = 6 - remainingAttempts;
    if (partIndex >= 0 && partIndex < parts.length) {
        const part = document.getElementById(parts[partIndex]);
        if (part) {
            part.style.opacity = '1';
            part.classList.add('fade-in');
        }
    }
}

/**
 * Update the word display with guessed letters
 */
function updateWordDisplay(letter, isCorrect) {
    const letterBoxes = document.querySelectorAll('.letter-box');
    let letterRevealed = false;
    
    for (let i = 0; i < window.gameState.word.length; i++) {
        const currentLetter = window.gameState.word[i];
        const letterBox = letterBoxes[i];
        
        if (currentLetter === letter) {
            letterBox.textContent = currentLetter;
            letterBox.classList.add('revealed');
            letterRevealed = true;
            
            // Add pop animation
            letterBox.classList.add('pop');
            setTimeout(() => {
                letterBox.classList.remove('pop');
            }, 300);
        } else if (window.gameState.guessedLetters.includes(currentLetter)) {
            letterBox.textContent = currentLetter;
        }
    }
    
    // If no new letters were revealed and the guess was incorrect,
    // add shake animation to the word display
    if (!letterRevealed && !isCorrect) {
        const wordDisplay = document.getElementById('word-display');
        wordDisplay.classList.add('shake');
        setTimeout(() => {
            wordDisplay.classList.remove('shake');
        }, 500);
    }
}

/**
 * Check if the game is won or lost
 */
function checkGameStatus() {
    // Check if player has lost (no more attempts)
    if (window.gameState.remainingAttempts <= 0) {
        window.gameState.isGameOver = true;
        endGame(false);
        return;
    }
    
    // Check if player has won (all letters guessed)
    const allLettersGuessed = [...window.gameState.word].every(letter => 
        window.gameState.guessedLetters.includes(letter)
    );
    
    if (allLettersGuessed) {
        window.gameState.isGameOver = true;
        endGame(true);
    }
}

/**
 * End the game
 */
function endGame(isWin) {
    // Stop the timer
    clearInterval(window.gameTimer);
    
    // Calculate final score
    const elapsedSeconds = Math.floor((new Date().getTime() - window.gameState.startTime) / 1000);
    const attemptsUsed = 6 - window.gameState.remainingAttempts;
    
    // Create score based on speed and remaining attempts
    const score = isWin ? 
        Math.max(1, Math.floor(1000 - (elapsedSeconds * 10) + (window.gameState.remainingAttempts * 50))) :
        0;
    
    // Show appropriate message and animation
    setTimeout(() => {
        if (isWin) {
            // Win animations
            const wordDisplay = document.getElementById('word-display');
            wordDisplay.classList.add('win-animation');
            
            // Show win modal
            showGameModal(
                'Congratulations!',
                `You've guessed the word: ${window.gameState.word}!<br>
                Time: ${elapsedSeconds} seconds<br>
                Attempts used: ${attemptsUsed}<br>
                Score: ${score}`,
                'success'
            );
            
            // Play win sound
            playSound('win');
        } else {
            // Reveal the full word
            revealFullWord();
            
            // Show lose modal
            showGameModal(
                'Game Over!',
                `The word was: ${window.gameState.word}.<br>
                Better luck next time!<br>
                Score: 0`,
                'error'
            );
            
            // Play lose sound
            playSound('lose');
        }
        
        // Save the score to local storage for now
        // In future sprints, this would be sent to the API
        saveScore({
            word: window.gameState.word,
            attemptsUsed: attemptsUsed,
            time: elapsedSeconds,
            score: score,
            result: isWin ? 'Won' : 'Lost',
            date: new Date().toISOString()
        });
        
    }, 500);
}

/**
 * Reveal the full word at the end of a lost game
 */
function revealFullWord() {
    const letterBoxes = document.querySelectorAll('.letter-box');
    
    for (let i = 0; i < window.gameState.word.length; i++) {
        const currentLetter = window.gameState.word[i];
        const letterBox = letterBoxes[i];
        
        if (!window.gameState.guessedLetters.includes(currentLetter)) {
            letterBox.textContent = currentLetter;
            letterBox.classList.add('incorrect');
        }
    }
}

/**
 * Show game modal with results
 */
function showGameModal(title, message, type) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.game-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.classList.add('game-modal', type);
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="modal-buttons">
                <button id="play-again-btn" class="btn">Play Again</button>
            </div>
        </div>
    `;
    
    // Add modal to the document
    document.body.appendChild(modal);
    
    // Add fade-in animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Add event listener for the Play Again button
    document.getElementById('play-again-btn').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            startNewGame();
        }, 300);
    });
}

/**
 * Save game score to localStorage
 */
function saveScore(scoreData) {
    // Get the current user
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    
    // Get existing scores or initialize empty array
    const scores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
    
    // Add new score with user information
    scores.push({
        ...scoreData,
        username: user.username,
        userId: user.id || scores.length + 1
    });
    
    // Save scores to localStorage
    localStorage.setItem('hangmanScores', JSON.stringify(scores));
    
    // Update user statistics
    updateUserStatistics(user.username, scoreData.result === 'Won');
}

/**
 * Update user statistics
 */
function updateUserStatistics(username, isWin) {
    // Get existing statistics or initialize
    const stats = JSON.parse(localStorage.getItem('hangmanStats')) || {};
    
    if (!stats[username]) {
        stats[username] = {
            totalGames: 0,
            gamesWon: 0,
            winRate: 0,
            streak: 0,
            bestStreak: 0
        };
    }
    
    // Update statistics
    stats[username].totalGames += 1;
    
    if (isWin) {
        stats[username].gamesWon += 1;
        stats[username].streak += 1;
        
        // Update best streak if current streak is better
        if (stats[username].streak > stats[username].bestStreak) {
            stats[username].bestStreak = stats[username].streak;
        }
    } else {
        stats[username].streak = 0;
    }
    
    // Calculate win rate
    stats[username].winRate = Math.round(
        (stats[username].gamesWon / stats[username].totalGames) * 100
    );
    
    // Save updated statistics
    localStorage.setItem('hangmanStats', JSON.stringify(stats));
}

/**
 * Play sound effects
 */
function playSound(type) {
    // This is a placeholder for actual sound effects
    // In a real implementation, you would load and play audio files
    
    // For now, we'll just log the sound type
    console.log(`Playing sound: ${type}`);
    
    // In future sprints, this would be implemented with actual audio
    // Example implementation:
    /*
    const audio = new Audio(`../sounds/${type}.mp3`);
    audio.play();
    */
}

// If we're using API integration in the future:
async function getWordFromAPI() {
    try {
        const response = await API.game.getRandomWord();
        return response.success ? response.word.text : null;
    } catch (error) {
        console.error('Error fetching word from API:', error);
        return null;
    }
}