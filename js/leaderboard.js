// leaderboard.js - Leaderboard functionality for Hangman Game - Sprint 1

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (placeholder for now)
    checkUserLoggedIn();
    
    // Initialize leaderboard with default timeframe (today)
    loadLeaderboard('today');
    
    // Add event listeners for time filters
    setupTimeFilters();
    
    // Add event listeners for pagination
    setupPagination();
});

/**
 * Check if the user is logged in
 * This is a placeholder for Sprint 1
 */
function checkUserLoggedIn() {
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    
    // For Sprint 1, we'll just log this information
    if (currentUser) {
        console.log('User is logged in:', JSON.parse(currentUser).username);
    } else {
        console.log('User is not logged in');
        // Uncomment in future sprints:
        // window.location.href = 'login.html';
    }
}

/**
 * Load leaderboard data based on timeframe
 * @param {string} timeframe - Timeframe filter (today, yesterday, alltime)
 */
function loadLeaderboard(timeframe) {
    // For Sprint 1, we'll use hardcoded data
    // In future sprints, this will come from the API
    
    // Update active button
    const filterButtons = document.querySelectorAll('.time-filter');
    filterButtons.forEach(button => {
        if (button.dataset.timeframe === timeframe) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Simulate API call with hardcoded data
    // This will be replaced with actual API call in future sprints
    let leaderboardData;
    
    if (timeframe === 'today') {
        leaderboardData = [
            { rank: 1, username: 'player1', score: 120, gamesPlayed: 10 },
            { rank: 2, username: 'player2', score: 95, gamesPlayed: 8 },
            { rank: 3, username: 'player3', score: 85, gamesPlayed: 7 }
        ];
    } else if (timeframe === 'yesterday') {
        leaderboardData = [
            { rank: 1, username: 'player5', score: 110, gamesPlayed: 9 },
            { rank: 2, username: 'player1', score: 90, gamesPlayed: 7 },
            { rank: 3, username: 'player8', score: 75, gamesPlayed: 6 }
        ];
    } else {
        // all time
        leaderboardData = [
            { rank: 1, username: 'player1', score: 550, gamesPlayed: 45 },
            { rank: 2, username: 'player5', score: 430, gamesPlayed: 38 },
            { rank: 3, username: 'player2', score: 380, gamesPlayed: 32 }
        ];
    }
    
    // Display the data
    displayLeaderboard(leaderboardData);
}

/**
 * Display the leaderboard data
 * @param {Array} data - Leaderboard data array
 */
function displayLeaderboard(data) {
    const leaderboardBody = document.getElementById('leaderboard-data');
    
    // Clear existing data
    leaderboardBody.innerHTML = '';
    
    // Add new data
    data.forEach((entry) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${entry.rank}</td>
            <td>${entry.username}</td>
            <td>${entry.score}</td>
            <td>${entry.gamesPlayed}</td>
        `;
        
        leaderboardBody.appendChild(row);
    });
    
    // Update pagination info (placeholder for now)
    document.getElementById('page-info').textContent = 'Page 1 of 1';
}

/**
 * Set up event listeners for time filter buttons
 */
function setupTimeFilters() {
    const filterButtons = document.querySelectorAll('.time-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const timeframe = this.dataset.timeframe;
            loadLeaderboard(timeframe);
        });
    });
}

/**
 * Set up event listeners for pagination buttons
 */
function setupPagination() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    // For Sprint 1, pagination is not functional
    // Will be implemented in future sprints
    
    prevButton.addEventListener('click', function() {
        console.log('Previous page clicked - will be implemented in future sprints');
    });
    
    nextButton.addEventListener('click', function() {
        console.log('Next page clicked - will be implemented in future sprints');
    });
}