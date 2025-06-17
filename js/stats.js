// Stats page for Hangman Game - Database-driven
document.addEventListener('DOMContentLoaded', function() {
    console.log('Stats page loaded');
    addAnimations();
    checkUserLoggedIn();
});

/**
 * Check if user is logged in
 */
function checkUserLoggedIn() {
    const sessionToken = localStorage.getItem('hangmanSessionToken');
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    
    if (!sessionToken || !currentUser) {
        console.log('User not logged in, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // Verify session with server
    fetch('../api/auth.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'verify',
            sessionToken: sessionToken
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const user = data.user;
            loadPlayerProfile(user);
            loadGameStatsFromDatabase(user, sessionToken);
        } else {
            // Session invalid, redirect to login
            localStorage.removeItem('hangmanSessionToken');
            localStorage.removeItem('hangmanCurrentUser');
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Session verification error:', error);
        window.location.href = 'login.html';
    });
}

/**
 * Load player profile information
 * @param {Object} user - User object from database
 */
function loadPlayerProfile(user) {
    // Display username
    document.getElementById('player-username').textContent = user.username;
    
    // Display join date (this would come from user.created_at in the database)
    let joinDate = 'Recently';
    if (user.created_at) {
        const date = new Date(user.created_at);
        joinDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    document.getElementById('player-joined-date').textContent = joinDate;
}

/**
 * Load game statistics from database
 * @param {Object} user - User object
 * @param {string} sessionToken - Session token
 */
function loadGameStatsFromDatabase(user, sessionToken) {
    fetch('../api/game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'getUserStats',
            sessionToken: sessionToken
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayStats(data.stats);
            loadRecentGamesFromDatabase(sessionToken);
        } else {
            console.error('Failed to load stats:', data.message);
            // Fallback to localStorage if database fails
            loadGameStatsFromLocalStorage(user);
        }
    })
    .catch(error => {
        console.error('Error loading stats:', error);
        // Fallback to localStorage if database fails
        loadGameStatsFromLocalStorage(user);
    });
}

/**
 * Display statistics on the page
 * @param {Object} stats - Statistics object
 */
function displayStats(stats) {
    console.log('Displaying stats:', stats);
    
    // Display main stats
    document.getElementById('total-games').textContent = stats.total_games || 0;
    document.getElementById('games-won').textContent = stats.games_won || 0;
    document.getElementById('win-rate').textContent = (stats.win_rate || 0) + '%';
    
    // Calculate average score
    const avgScore = stats.total_games > 0 ? 
        Math.round((stats.total_score || 0) / stats.total_games) : 0;
    
    const additionalStats = {
        'current-streak': stats.current_streak || 0,
        'best-streak': stats.best_streak || 0,
        'avg-score': avgScore,
        'week-streak': 0, // These would need more complex calculation
        'month-streak': 0
    };
    
    for (const [id, value] of Object.entries(additionalStats)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Load achievements
    loadAchievementsFromStats(stats);
}

/**
 * Load recent games from database
 * @param {string} sessionToken - Session token
 */
function loadRecentGamesFromDatabase(sessionToken) {
    fetch('../api/game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'getUserHistory',
            sessionToken: sessionToken,
            limit: 10
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayRecentGames(data.history);
        } else {
            console.error('Failed to load game history:', data.message);
            displayRecentGames([]);
        }
    })
    .catch(error => {
        console.error('Error loading game history:', error);
        displayRecentGames([]);
    });
}

/**
 * Display recent games
 * @param {Array} recentGames - Recent games from database
 */
function displayRecentGames(recentGames) {
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
            const date = new Date(game.played_at);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${game.word}</td>
                <td>${game.score}</td>
                <td>${game.attempts_used}/6</td>
                <td class="${game.result === 'Won' ? 'win' : 'loss'}">${game.result}</td>
            `;
            
            recentGamesTableBody.appendChild(row);
        });
    }
}

/**
 * Load user achievements based on stats
 * @param {Object} stats - User statistics
 */
function loadAchievementsFromStats(stats) {
    // Define achievements
    const achievements = [
        {
            id: 'first-win',
            title: 'First Win',
            description: 'Win your first game',
            isUnlocked: (stats.games_won || 0) > 0,
            icon: '🏆'
        },
        {
            id: 'word-master',
            title: 'Word Master',
            description: 'Win 10 games in total',
            isUnlocked: (stats.games_won || 0) >= 10,
            icon: '📚'
        },
        {
            id: 'streak-master',
            title: 'Streak Master',
            description: 'Win 5 games in a row',
            isUnlocked: (stats.best_streak || 0) >= 5,
            icon: '🔥'
        },
        {
            id: 'hangman-expert',
            title: 'Hangman Expert',
            description: 'Play 25 games total',
            isUnlocked: (stats.total_games || 0) >= 25,
            icon: '🎮'
        },
        {
            id: 'score-hunter',
            title: 'Score Hunter',
            description: 'Achieve a score of 100 or higher',
            isUnlocked: (stats.best_score || 0) >= 100,
            icon: '💯'
        },
        {
            id: 'consistency',
            title: 'Consistency',
            description: 'Maintain a 70% win rate over 10+ games',
            isUnlocked: (stats.total_games || 0) >= 10 && (stats.win_rate || 0) >= 70,
            icon: '⚖️'
        }
    ];
    
    displayAchievements(achievements);
}

/**
 * Display achievements
 * @param {Array} achievements - Array of achievement objects
 */
function displayAchievements(achievements) {
    const achievementsGrid = document.getElementById('achievements-container');
    achievementsGrid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement ${achievement.isUnlocked ? 'unlocked' : 'locked'}`;
        
        achievementCard.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h4>${achievement.title}</h4>
            <p>${achievement.description}</p>
        `;
        
        achievementsGrid.appendChild(achievementCard);
    });
}

/**
 * FALLBACK: Load stats from localStorage (only used if database fails)
 */
function loadGameStatsFromLocalStorage(user) {
    const stats = JSON.parse(localStorage.getItem('hangmanStats')) || {};
    const userStats = stats[user.username] || {
        total_games: 0,
        games_won: 0,
        win_rate: 0,
        current_streak: 0,
        best_streak: 0,
        total_score: 0,
        best_score: 0
    };
    
    console.log('Using localStorage fallback for stats:', userStats);
    displayStats(userStats);
    loadRecentGamesFromLocalStorage(user);
}

/**
 * FALLBACK: Load recent games from localStorage
 */
function loadRecentGamesFromLocalStorage(user) {
    const scores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
    
    // Filter scores for current user and sort by date (most recent first)
    const userScores = scores
        .filter(score => score.username === user.username)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Limit to the most recent 10 games
    const recentGames = userScores.slice(0, 10);
    
    displayRecentGames(recentGames.map(game => ({
        played_at: game.date,
        word: game.word,
        score: game.score || 0,
        attempts_used: game.attemptsUsed,
        result: game.result
    })));
}

/**
 * Add animations to the page elements
 */
function addAnimations() {
    const elements = document.querySelectorAll('.stat-card, .achievement-card, .recent-games');
    
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
}