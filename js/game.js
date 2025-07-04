// Hangman Game Implementation
class HangmanGame {
    constructor() {
        this.currentWord = '';
        this.guessedLetters = new Set();
        this.incorrectGuesses = 0;
        this.maxAttempts = 6;
        this.score = 0;
        this.gameWon = false;
        this.gameOver = false;
        
        this.wordLists = {
            easy: ['cat', 'dog', 'fish', 'bird', 'tree', 'sun', 'moon', 'star', 'book', 'car'],
            medium: ['computer', 'elephant', 'mountain', 'rainbow', 'kitchen', 'garden', 'picture', 'monster', 'guitar', 'planet'],
            hard: ['symphony', 'psychology', 'archaeology', 'philosophy', 'technology', 'anthropology', 'extraordinary', 'architecture', 'sophisticated', 'hypothetical'],
            programming: ['javascript', 'function', 'variable', 'algorithm', 'database', 'framework', 'debugging', 'repository', 'inheritance', 'polymorphism'],
            mixed: []
        };
        
        this.wordLists.mixed = [
            ...this.wordLists.easy,
            ...this.wordLists.medium,
            ...this.wordLists.hard,
            ...this.wordLists.programming
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.setupEventListeners();
        this.createKeyboard();
        this.createHangmanSVG();
        this.newGame();
    }
    
    setupEventListeners() {
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });
        
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.giveHint();
        });
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.hideModal();
            this.newGame();
        });
        
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('difficulty').addEventListener('change', () => {
            this.newGame();
        });
        
        document.addEventListener('keydown', (e) => {
            const letter = e.key.toLowerCase();
            if (letter >= 'a' && letter <= 'z' && !this.gameOver) {
                this.guessLetter(letter);
            }
        });
        
        document.getElementById('game-modal').addEventListener('click', (e) => {
            if (e.target.id === 'game-modal') {
                this.hideModal();
            }
        });
    }
    
    createKeyboard() {
        const keyboard = document.getElementById('keyboard');
        keyboard.innerHTML = '';
        
        const qwertyLayout = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm']
        ];
        
        qwertyLayout.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';
            
            row.forEach(letter => {
                const key = document.createElement('button');
                key.className = 'key';
                key.textContent = letter.toUpperCase();
                key.setAttribute('data-letter', letter);
                key.addEventListener('click', () => this.guessLetter(letter));
                keyboardRow.appendChild(key);
            });
            
            keyboard.appendChild(keyboardRow);
        });
    }
    
    createHangmanSVG() {
        const hangmanDisplay = document.querySelector('.hangman-display');
        hangmanDisplay.innerHTML = '<svg width="200" height="250" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="230" x2="150" y2="230" stroke="#8B5CF6" stroke-width="4"/><line x1="30" y1="230" x2="30" y2="20" stroke="#8B5CF6" stroke-width="4"/><line x1="30" y1="20" x2="120" y2="20" stroke="#8B5CF6" stroke-width="4"/><line x1="120" y1="20" x2="120" y2="50" stroke="#8B5CF6" stroke-width="4"/><circle id="head" cx="120" cy="70" r="20" stroke="#EF4444" stroke-width="3" fill="none" style="display: none"/><line id="body" x1="120" y1="90" x2="120" y2="170" stroke="#EF4444" stroke-width="3" style="display: none"/><line id="leftarm" x1="120" y1="120" x2="90" y2="140" stroke="#EF4444" stroke-width="3" style="display: none"/><line id="rightarm" x1="120" y1="120" x2="150" y2="140" stroke="#EF4444" stroke-width="3" style="display: none"/><line id="leftleg" x1="120" y1="170" x2="90" y2="200" stroke="#EF4444" stroke-width="3" style="display: none"/><line id="rightleg" x1="120" y1="170" x2="150" y2="200" stroke="#EF4444" stroke-width="3" style="display: none"/></svg>';
    }
    
    async getRandomWord() {
        const difficulty = document.getElementById('difficulty').value;
        
        try {
            const response = await fetch('https://random-word-api.herokuapp.com/word');
            if (response.ok) {
                const data = await response.json();
                if (data && data[0] && data[0].length >= 4) {
                    return data[0].toLowerCase();
                }
            }
        } catch (error) {
            console.log('External API failed, using local words');
        }
        
        const wordList = this.wordLists[difficulty] || this.wordLists.mixed;
        return wordList[Math.floor(Math.random() * wordList.length)];
    }
    
    async newGame() {
        this.currentWord = await this.getRandomWord();
        this.guessedLetters.clear();
        this.incorrectGuesses = 0;
        this.gameWon = false;
        this.gameOver = false;
        
        this.updateDisplay();
        this.resetKeyboard();
        this.resetHangman();
        this.hideModal();
        
        console.log('New game started with word:', this.currentWord);
    }
    
    guessLetter(letter) {
        if (this.gameOver || this.guessedLetters.has(letter)) {
            return;
        }
        
        this.guessedLetters.add(letter);
        
        const keyElement = document.querySelector('[data-letter="' + letter + '"]');
        if (keyElement) {
            keyElement.classList.add('disabled');
        }
        
        if (this.currentWord.includes(letter)) {
            if (keyElement) {
                keyElement.classList.add('correct');
            }
            
            const isWordComplete = this.currentWord.split('').every(char => 
                this.guessedLetters.has(char)
            );
            
            if (isWordComplete) {
                this.gameWon = true;
                this.gameOver = true;
                this.score += this.calculateScore();
                this.showModal('Congratulations!', 'You won! The word was "' + this.currentWord.toUpperCase() + '". Score: +' + this.calculateScore());
                this.saveGameResult(true);
            }
        } else {
            if (keyElement) {
                keyElement.classList.add('incorrect');
            }
            
            this.incorrectGuesses++;
            this.drawHangmanPart();
            
            if (this.incorrectGuesses >= this.maxAttempts) {
                this.gameOver = true;
                this.revealWord();
                this.showModal('Game Over', 'You lost! The word was "' + this.currentWord.toUpperCase() + '". Try again!');
                this.saveGameResult(false);
            }
        }
        
        this.updateDisplay();
    }
    
    giveHint() {
        if (this.gameOver) return;
        
        const unguessedLetters = this.currentWord.split('')
            .filter(letter => !this.guessedLetters.has(letter));
        
        if (unguessedLetters.length > 0) {
            const hintLetter = unguessedLetters[0];
            this.guessLetter(hintLetter);
            this.score = Math.max(0, this.score - 10);
        }
    }
    
    calculateScore() {
        const baseScore = this.currentWord.length * 10;
        const attemptsBonus = (this.maxAttempts - this.incorrectGuesses) * 5;
        return baseScore + attemptsBonus;
    }
    
    updateDisplay() {
        const wordDisplay = document.getElementById('word-display');
        wordDisplay.innerHTML = '';
        
        this.currentWord.split('').forEach(letter => {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box';
            
            if (this.guessedLetters.has(letter)) {
                letterBox.textContent = letter.toUpperCase();
                letterBox.classList.add('revealed');
            }
            
            wordDisplay.appendChild(letterBox);
        });
        
        document.getElementById('attempts').textContent = this.maxAttempts - this.incorrectGuesses;
        document.getElementById('score').textContent = this.score;
    }
    
    resetKeyboard() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('disabled', 'correct', 'incorrect');
        });
    }
    
    resetHangman() {
        const bodyParts = ['head', 'body', 'leftarm', 'rightarm', 'leftleg', 'rightleg'];
        bodyParts.forEach(part => {
            const element = document.getElementById(part);
            if (element) {
                element.style.display = 'none';
            }
        });
    }
    
    drawHangmanPart() {
        const bodyParts = ['head', 'body', 'leftarm', 'rightarm', 'leftleg', 'rightleg'];
        const partToDraw = bodyParts[this.incorrectGuesses - 1];
        
        if (partToDraw) {
            const element = document.getElementById(partToDraw);
            if (element) {
                element.style.display = 'block';
            }
        }
    }
    
    revealWord() {
        const wordDisplay = document.getElementById('word-display');
        const letterBoxes = wordDisplay.querySelectorAll('.letter-box');
        
        this.currentWord.split('').forEach((letter, index) => {
            if (!this.guessedLetters.has(letter)) {
                letterBoxes[index].textContent = letter.toUpperCase();
                letterBoxes[index].classList.add('incorrect-reveal');
            }
        });
    }
    
    showModal(title, message) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        document.getElementById('game-modal').classList.add('show');
    }
    
    hideModal() {
        document.getElementById('game-modal').classList.remove('show');
    }
    
    async saveGameResult(won) {
        const sessionToken = localStorage.getItem('hangmanSessionToken');
        
        if (!sessionToken) {
            console.error('No session token found!');
            return;
        }
        
        const gameData = {
            action: 'saveScore',
            sessionToken: sessionToken,
            word: this.currentWord,
            score: won ? this.calculateScore() : 0,
            attemptsUsed: this.incorrectGuesses,
            result: won ? 'Won' : 'Lost'
        };
        
        try {
            console.log('Saving game result to database:', gameData);
            
            const response = await fetch('../api/game.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Game result saved to database successfully!');
            } else {
                console.error('❌ Failed to save game result:', data.message);
                // Fallback to localStorage if database fails
                this.saveToLocalStorageFallback(won);
            }
        } catch (error) {
            console.error('❌ Error saving game result:', error);
            // Fallback to localStorage if database fails
            this.saveToLocalStorageFallback(won);
        }
    }
    
    // Fallback method to save to localStorage if database fails
    saveToLocalStorageFallback(won) {
        console.log('Using localStorage fallback...');
        
        const hangmanCurrentUserData = localStorage.getItem('hangmanCurrentUser');
        const currentUser = hangmanCurrentUserData ? JSON.parse(hangmanCurrentUserData).username : null;
        
        if (!currentUser) {
            console.error('No current user found!');
            return;
        }
        
        // Save to localStorage as fallback
        const hangmanScores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
        hangmanScores.push({
            username: currentUser,
            score: won ? this.calculateScore() : 0,
            word: this.currentWord,
            result: won ? 'Won' : 'Lost',
            date: new Date().toISOString(),
            attempts: this.incorrectGuesses,
            attemptsUsed: this.incorrectGuesses
        });
        localStorage.setItem('hangmanScores', JSON.stringify(hangmanScores));
        
        console.log('Saved to localStorage fallback');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hangman game initializing...');
    new HangmanGame();
});

document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('hangmanCurrentUser');
            localStorage.removeItem('hangmanSessionToken');
            window.location.href = '../index.html';
        });
    }
});
