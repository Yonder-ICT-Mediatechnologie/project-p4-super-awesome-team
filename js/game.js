// game.js - Basic game logic for Hangman Game - Sprint 1

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (will be implemented in next sprint with actual authentication)
    // For now, we'll use a placeholder function that will be expanded in future sprints
    checkUserLoggedIn();
    
    // Initialize game elements
    initializeKeyboard();
    
    // For Sprint 1, we'll use a hardcoded word list
    // In future sprints, this will come from the backend API
    const wordList = ['HANGMAN', 'JAVASCRIPT', 'PROJECT', 'DEVELOPMENT', 'SPRINT'];
    
    // Select a random word for the game
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    
    // Setup the game with the selected word
    setupGame(randomWord);
    
    // Add event listener for the "New Game" button
    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', function() {
            const newRandomWord = wordList[Math.floor(Math.random() * wordList.length)];
            setupGame(newRandomWord);
        });
    }
});

/**
 * Check if the user is logged in
 * This is a placeholder for Sprint 1
 * In future sprints, this will actually check with the backend
 */
function checkUserLoggedIn() {
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    
    // For Sprint 1, we'll just log this information
    // In future sprints, we'll redirect to login if not logged in
    if (currentUser) {
        console.log('User is logged in:', JSON.parse(currentUser).username);
    } else {
        console.log('User is not logged in');
        // Uncomment in future sprints:
        // window.location.href = 'login.html';
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
 * Set up the game with a specific word
 */
function setupGame(word) {
    // Store game state
    window.gameState = {
        word: word,
        guessedLetters: [],
        remainingAttempts: 6,
        isGameOver: false
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
    } else {
        key.classList.add('incorrect');
        // Decrease remaining attempts
        window.gameState.remainingAttempts--;
        document.getElementById('attempts').textContent = window.gameState.remainingAttempts;
    }
    
    // Disable the key
    key.style.pointerEvents = 'none';
    
    // Update word display
    updateWordDisplay();
    
    // Check win/lose conditions
    checkGameStatus();
}

/**
 * Update the word display with guessed letters
 */
function updateWordDisplay() {
    const letterBoxes = document.querySelectorAll('.letter-box');
    
    for (let i = 0; i < window.gameState.word.length; i++) {
        const currentLetter = window.gameState.word[i];
        
        if (window.gameState.guessedLetters.includes(currentLetter)) {
            letterBoxes[i].textContent = currentLetter;
        } else {
            letterBoxes[i].textContent = '';
        }
    }
}

/**
 * Check if the game is won or lost
 */
function checkGameStatus() {
    // Check if player has lost (no more attempts)
    if (window.gameState.remainingAttempts <= 0) {
        window.gameState.isGameOver = true;
        setTimeout(() => {
            alert(`Game Over! The word was: ${window.gameState.word}`);
        }, 500);
        return;
    }
    
    // Check if player has won (all letters guessed)
    const allLettersGuessed = [...window.gameState.word].every(letter => 
        window.gameState.guessedLetters.includes(letter)
    );
    
    if (allLettersGuessed) {
        window.gameState.isGameOver = true;
        setTimeout(() => {
            alert(`Congratulations! You've guessed the word: ${window.gameState.word}`);
            // In future sprints, we'll save the score to the backend here
        }, 500);
    }
}