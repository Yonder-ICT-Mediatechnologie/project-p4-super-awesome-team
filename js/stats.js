// Enhanced stats.js - Improved Statistics functionality for Hangman Game

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = checkUserLoggedIn();
    
    if (currentUser) {
        // Load player profile
        loadPlayerProfile(currentUser);
        
        // Load game statistics
        loadGameStats(currentUser);
        
        // Load recent games
        loadRecentGames(currentUser);
        
        // Load achievements
        loadAchievements(currentUser);
        
        // Add chart visualizations
        addStatCharts(currentUser);
    }
    
    // Add animation classes
    addAnimations();
});

/**
 * Check if the user is logged in
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
        window.location.href = 'login.html';
        return null;
    }
}

/**
 * Load player profile information
 * @param {Object} user - User object
 */
function loadPlayerProfile(user) {
    // Display username
    document.getElementById('player-username').textContent = user.username;
    
    // Get registered date from localStorage
    const users = JSON.parse(localStorage.getItem('hangmanUsers')) || [];
    const userInfo = users.find(u => u.username === user.username);
    
    let joinDate = 'April 5, 2025';
    if (userInfo && userInfo.dateRegistered) {
        // Format the date nicely
        const date = new Date(userInfo.dateRegistered);
        joinDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Display join date
    document.getElementById('player-joined-date').textContent = joinDate;
}

/**
 * Load game statistics
 * @param {Object} user - User object
 */
function loadGameStats(user) {
    // Get stats from localStorage
    const stats = JSON.parse(localStorage.getItem('hangmanStats')) || {};
    const userStats = stats[user.username] || {
        totalGames: 0,
        gamesWon: 0,
        winRate: 0,
        streak: 0,
        bestStreak: 0
    };
    
    // Get scores from localStorage
    const scores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
    const userScores = scores.filter(score => score.username === user.username);
    
    // Calculate average attempts if there are any scores
    let avgAttempts = 0;
    if (userScores.length > 0) {
        const totalAttempts = userScores.reduce((sum, score) => sum + score.attemptsUsed, 0);
        avgAttempts = (totalAttempts / userScores.length).toFixed(1);
    }
    
    // Display stats
    document.getElementById('total-games').textContent = userStats.totalGames;
    document.getElementById('games-won').textContent = userStats.gamesWon;
    document.getElementById('win-rate').textContent = userStats.winRate + '%';
    document.getElementById('avg-attempts').textContent = avgAttempts;
    
    // Add more detailed stats if the elements exist
    const additionalStats = {
        'current-streak': userStats.streak || 0,
        'best-streak': userStats.bestStreak || 0
    };
    
    for (const [id, value] of Object.entries(additionalStats)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

/**
 * Load recent games data
 * @param {Object} user - User object
 */
function loadRecentGames(user) {
    // Get scores from localStorage
    const scores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
    
    // Filter scores for current user and sort by date (most recent first)
    const userScores = scores
        .filter(score => score.username === user.username)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Limit to the most recent 10 games
    const recentGames = userScores.slice(0, 10);
    
    // Display recent games
    const recentGamesTableBody = document.getElementById('recent-games-data');
    
    // Clear existing data
    recentGamesTableBody.innerHTML = '';
    
    if (recentGames.length === 0) {
        // No games played yet
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">No games played yet</td>';
        recentGamesTableBody.appendChild(row);
    } else {
        // Add game data
        recentGames.forEach(game => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(game.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${game.word}</td>
                <td>${game.attemptsUsed}</td>
                <td>${game.time}</td>
                <td class="${game.result === 'Won' ? 'win' : 'loss'}">${game.result}</td>
            `;
            
            recentGamesTableBody.appendChild(row);
        });
    }
}

/**
 * Load user achievements
 * @param {Object} user - User object
 */
function loadAchievements(user) {
    // Get stats from localStorage
    const stats = JSON.parse(localStorage.getItem('hangmanStats')) || {};
    const userStats = stats[user.username] || { totalGames: 0, gamesWon: 0 };
    
    // Get scores from localStorage
    const scores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
    const userScores = scores.filter(score => score.username === user.username);
    
    // Define achievements
    const achievements = [
        {
            id: 'first-win',
            title: 'First Win',
            description: 'Win your first game',
            isUnlocked: userStats.gamesWon > 0,
            icon: '🏆'
        },
        {
            id: 'perfect-game',
            title: 'Perfect Game',
            description: 'Win a game without any incorrect guesses',
            isUnlocked: userScores.some(score => score.result === 'Won' && score.attemptsUsed === 0),
            icon: '✨'
        },
        {
            id: 'word-master',
            title: 'Word Master',
            description: 'Win 10 games in total',
            isUnlocked: userStats.gamesWon >= 10,
            icon: '📚'
        },
        {
            id: 'quick-thinker',
            title: 'Quick Thinker',
            description: 'Win a game in under 30 seconds',
            isUnlocked: userScores.some(score => score.result === 'Won' && score.time < 30),
            icon: '⚡'
        },
        {
            id: 'streak-master',
            title: 'Streak Master',
            description: 'Win 5 games in a row',
            isUnlocked: userStats.bestStreak >= 5,
            icon: '🔥'
        },
        {
            id: 'hangman-expert',
            title: 'Hangman Expert',
            description: 'Play 25 games total',
            isUnlocked: userStats.totalGames >= 25,
            icon: '🎮'
        }
    ];
    
    // Display achievements
    const achievementsContainer = document.getElementById('achievements-container');
    
    // Clear existing achievements
    achievementsContainer.innerHTML = '';
    
    // Add achievement cards
    achievements.forEach(achievement => {
        const card = document.createElement('div');
        card.classList.add('achievement');
        
        if (achievement.isUnlocked) {
            card.classList.add('unlocked');
        }
        
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h4>${achievement.title}</h4>
            <p>${achievement.description}</p>
            <span class="achievement-status ${achievement.isUnlocked ? 'unlocked' : 'locked'}">
                ${achievement.isUnlocked ? 'Unlocked' : 'Locked'}
            </span>
        `;
        
        achievementsContainer.appendChild(card);
    });
}

/**
 * Add statistical charts
 * @param {Object} user - User object
 */
function addStatCharts(user) {
    // Check if chart container exists, if not, create it
    let chartContainer = document.querySelector('.stats-charts');
    if (!chartContainer) {
        // Create charts section
        chartContainer = document.createElement('div');
        chartContainer.classList.add('stats-charts');
        
        const chartTitle = document.createElement('h3');
        chartTitle.textContent = 'Performance Trends';
        chartContainer.appendChild(chartTitle);
        
        // Create canvas for the chart
        const canvas = document.createElement('canvas');
        canvas.id = 'performance-chart';
        chartContainer.appendChild(canvas);
        
        // Add the chart container to the stats container
        const statsContainer = document.querySelector('.stats-container');
        statsContainer.insertBefore(chartContainer, document.querySelector('.achievement-section'));
    }
    
    // Get scores from localStorage
    const scores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
    const userScores = scores
        .filter(score => score.username === user.username)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (userScores.length === 0) {
        // No data to chart
        chartContainer.innerHTML = `
            <h3>Performance Trends</h3>
            <p class="no-data">Play some games to see your performance trends!</p>
        `;
        return;
    }
    
    // For the actual implementation, you would use a charting library like Chart.js
    // For now, we'll just create a placeholder for the chart
    const chartCanvas = document.getElementById('performance-chart');
    
    if (chartCanvas) {
        chartCanvas.style.width = '100%';
        chartCanvas.style.height = '300px';
        chartCanvas.style.border = '1px solid #ddd';
        chartCanvas.style.borderRadius = '8px';
        chartCanvas.style.backgroundColor = '#f8f9fa';
        
        // Add text inside the canvas
        const ctx = chartCanvas.getContext('2d');
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Performance Chart (To be implemented with Chart.js)', chartCanvas.width / 2, chartCanvas.height / 2);
    }
}

/**
 * Add animations to the page elements
 */
function addAnimations() {
    // Add fade-in animation to statistics boxes
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, index) => {
        box.classList.add('fade-in');
        box.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add animations to achievements
    const achievements = document.querySelectorAll('.achievement');
    achievements.forEach((achievement, index) => {
        achievement.classList.add('slide-in');
        achievement.style.animationDelay = `${0.3 + index * 0.1}s`;
    });
    
    // Add floating animation to unlocked achievements
    const unlockedAchievements = document.querySelectorAll('.achievement.unlocked');
    unlockedAchievements.forEach(achievement => {
        achievement.classList.add('float');
    });
}