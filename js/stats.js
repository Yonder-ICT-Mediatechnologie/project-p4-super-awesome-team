// stats.js - Statistics functionality for Hangman Game - Sprint 1

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (placeholder for now)
    const currentUser = checkUserLoggedIn();
    
    if (currentUser) {
        // Load player profile
        loadPlayerProfile(currentUser);
        
        // Load game statistics
        loadGameStats(currentUser);
        
        // Load recent games
        loadRecentGames(currentUser);
        
        // Load achievements (placeholder for future sprints)
        loadAchievements(currentUser);
    }
});

/**
 * Check if the user is logged in
 * This is a placeholder for Sprint 1
 * @returns {Object|null} The current user object or null
 */
function checkUserLoggedIn() {
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    
    if (currentUser) {
        const userObj = JSON.parse(currentUser);
        console.log('User is logged in:', userObj.username);
        return userObj;
    } else {
        console.log('User is not logged in');
        // Uncomment in future sprints:
        // window.location.href = 'login.html';
        return null;
    }
}

/**
 * Load player profile information
 * @param {Object} user - User object
 */
function loadPlayerProfile(user) {
    // For Sprint 1, we'll use hardcoded data + the current user's username
    // In future sprints, this will come from the API
    
    // Display username
    document.getElementById('player-username').textContent = user.username;
    
    // Display join date (hardcoded for Sprint 1)
    document.getElementById('player-joined-date').textContent = 'April 5, 2025';
}

/**
 * Load game statistics
 * @param {Object} user - User object
 */
function loadGameStats(user) {
    // For Sprint 1, we'll use hardcoded data
    // In future sprints, this will come from the API
    
    // Hardcoded stats for Sprint 1
    const stats = {
        totalGames: 12,
        gamesWon: 9,
        winRate: 75,
        avgAttempts: 3.2
    };
    
    // Display stats
    document.getElementById('total-games').textContent = stats.totalGames;
    document.getElementById('games-won').textContent = stats.gamesWon;
    document.getElementById('win-rate').textContent = stats.winRate + '%';
    document.getElementById('avg-attempts').textContent = stats.avgAttempts;
}

/**
 * Load recent games data
 * @param {Object} user - User object
 */
function loadRecentGames(user) {
    // For Sprint 1, we'll use hardcoded data
    // In future sprints, this will come from the API
    
    // Hardcoded games for Sprint 1
    const recentGames = [
        {
            date: '2025-04-07',
            word: 'JAVASCRIPT',
            attemptsUsed: 2,
            time: 45,
            result: 'Won'
        },
        {
            date: '2025-04-06',
            word: 'HANGMAN',
            attemptsUsed: 1,
            time: 30,
            result: 'Won'
        },
        {
            date: '2025-04-05',
            word: 'DEVELOPER',
            attemptsUsed: 4,
            time: 62,
            result: 'Won'
        },
        {
            date: '2025-04-04',
            word: 'TYPESCRIPT',
            attemptsUsed: 6,
            time: 120,
            result: 'Lost'
        },
        {
            date: '2025-04-03',
            word: 'PROGRAMMING',
            attemptsUsed: 3,
            time: 55,
            result: 'Won'
        }
    ];
    
    // Display recent games
    const recentGamesTableBody = document.getElementById('recent-games-data');
    
    // Clear existing data
    recentGamesTableBody.innerHTML = '';
    
    // Add new data
    recentGames.forEach(game => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${game.date}</td>
            <td>${game.word}</td>
            <td>${game.attemptsUsed}</td>
            <td>${game.time}</td>
            <td>${game.result}</td>
        `;
        
        recentGamesTableBody.appendChild(row);
    });
}

/**
 * Load achievements
 * @param {Object} user - User object
 */
function loadAchievements(user) {
    // For Sprint 1, we'll use the hardcoded achievements in the HTML
    // In future sprints, this will be dynamically loaded from the API
    console.log('Achievements will be implemented in future sprints');
}