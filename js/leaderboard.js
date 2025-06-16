// Enhanced leaderboard.js - Improved Leaderboard functionality for Hangman Game

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserLoggedIn();
    
    // Initialize leaderboard with default timeframe (today)
    loadLeaderboard('today');
    
    // Add event listeners for time filters
    setupTimeFilters();
    
    // Add event listeners for pagination
    setupPagination();
    
    // Add animations
    addAnimations();
});

/**
 * Check if the user is logged in
 */
function checkUserLoggedIn() {
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    
    if (currentUser) {
        console.log('User is logged in:', JSON.parse(currentUser).username);
    } else {
        console.log('User is not logged in');
        window.location.href = 'login.html';
    }
}

/**
 * Load leaderboard data from database API
 * @param {string} timeframe - Timeframe filter (today, yesterday, alltime)
 * @param {number} page - Page number for pagination
 */
function loadLeaderboard(timeframe, page = 1) {
    // Update active button
    const filterButtons = document.querySelectorAll('.time-filter');
    filterButtons.forEach(button => {
        if (button.dataset.timeframe === timeframe) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Load from localStorage only
    loadLeaderboardFromLocalStorage(timeframe, page);
}

/**
 * Fallback function to load leaderboard from localStorage
 */
function loadLeaderboardFromLocalStorage(timeframe, page = 1) {
    const scores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
    
    // Filter scores based on timeframe
    let filteredScores = [];
    const now = new Date();
    
    if (timeframe === 'today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        filteredScores = scores.filter(score => score.date >= today);
    } else if (timeframe === 'yesterday') {
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        filteredScores = scores.filter(score => score.date >= yesterday && score.date < today);
    } else {
        filteredScores = [...scores];
    }
    
    // Group scores by username and calculate total scores
    const leaderboardData = processLeaderboardData(filteredScores);
    
    // Set up pagination
    const itemsPerPage = 10;
    const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
    
    page = Math.max(1, Math.min(page, totalPages));
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = leaderboardData.slice(startIndex, endIndex);
    
    displayLeaderboard(pageData, startIndex);
    updatePagination(page, totalPages, timeframe);
}

/**
 * Process scores into leaderboard data
 * @param {Array} scores - Array of score objects
 * @returns {Array} Processed leaderboard data
 */
function processLeaderboardData(scores) {
    // Group scores by username
    const scoresByUser = {};
    
    scores.forEach(score => {
        const username = score.username;
        
        if (!scoresByUser[username]) {
            scoresByUser[username] = {
                username,
                totalScore: 0,
                gamesPlayed: 0,
                gamesWon: 0,
                avgScore: 0
            };
        }
        
        scoresByUser[username].totalScore += score.score || 0;
        scoresByUser[username].gamesPlayed += 1;
        
        if (score.result === 'Won') {
            scoresByUser[username].gamesWon += 1;
        }
    });
    
    // Convert to array and calculate average scores
    const leaderboardData = Object.values(scoresByUser);
    
    leaderboardData.forEach(entry => {
        entry.avgScore = entry.gamesPlayed > 0 ? 
            Math.round(entry.totalScore / entry.gamesPlayed) : 0;
    });
    
    // Sort by total score (highest first)
    leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
    
    // Add rank
    leaderboardData.forEach((entry, index) => {
        entry.rank = index + 1;
    });
    
    return leaderboardData;
}

/**
 * Display leaderboard data from API
 * @param {Array} data - Leaderboard data from API
 */
function displayLeaderboardFromAPI(data) {
    const leaderboardBody = document.getElementById('leaderboard-data');
    
    // Clear existing data
    leaderboardBody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">No data available for this timeframe</td>';
        leaderboardBody.appendChild(row);
        return;
    }
    
    // Get current user for highlighting
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    const currentUsername = currentUser ? JSON.parse(currentUser).username : '';
    
    // Add new data
    data.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Highlight current user
        if (entry.player === currentUsername) {
            row.classList.add('current-user');
        }
        
        // Add medal icons for top 3
        let rankDisplay = entry.rank;
        if (entry.rank === 1) {
            rankDisplay = '🥇 1';
        } else if (entry.rank === 2) {
            rankDisplay = '🥈 2';
        } else if (entry.rank === 3) {
            rankDisplay = '🥉 3';
        }
        
        row.innerHTML = `
            <td>${rankDisplay}</td>
            <td>${entry.player}</td>
            <td>${entry.score}</td>
            <td>${entry.gamesPlayed}</td>
            <td>${entry.gamesWon}</td>
        `;
        
        leaderboardBody.appendChild(row);
        
        // Add animation with delay based on index
        row.style.animationDelay = `${index * 0.1}s`;
        row.classList.add('fade-in');
    });
}

/**
 * Display the leaderboard data (fallback)
 * @param {Array} data - Leaderboard data array
 * @param {number} startIndex - Starting index for rank calculation
 */
function displayLeaderboard(data, startIndex = 0) {
    const leaderboardBody = document.getElementById('leaderboard-data');
    
    // Clear existing data
    leaderboardBody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">No data available for this timeframe</td>';
        leaderboardBody.appendChild(row);
        return;
    }
    
    // Get current user for highlighting
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    const currentUsername = currentUser ? JSON.parse(currentUser).username : '';
    
    // Add new data
    data.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Highlight current user
        if (entry.username === currentUsername) {
            row.classList.add('current-user');
        }
        
        // Add medal icons for top 3
        let rankDisplay = entry.rank;
        if (entry.rank === 1) {
            rankDisplay = '🥇 1';
        } else if (entry.rank === 2) {
            rankDisplay = '🥈 2';
        } else if (entry.rank === 3) {
            rankDisplay = '🥉 3';
        }
        
        row.innerHTML = `
            <td>${rankDisplay}</td>
            <td>${entry.username}</td>
            <td>${entry.totalScore}</td>
            <td>${entry.gamesPlayed}</td>
            <td>${entry.gamesWon}</td>
        `;
        
        leaderboardBody.appendChild(row);
        
        // Add animation with delay based on index
        row.style.animationDelay = `${index * 0.1}s`;
        row.classList.add('fade-in');
    });
}

/**
 * Update pagination controls and info
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {string} timeframe - Current timeframe filter
 */
function updatePagination(currentPage, totalPages, timeframe) {
    const pageInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    // Update page info
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    
    // Update button states
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages || totalPages === 0;
    
    // Update button event listeners
    prevButton.onclick = () => {
        if (currentPage > 1) {
            loadLeaderboard(timeframe, currentPage - 1);
        }
    };
    
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            loadLeaderboard(timeframe, currentPage + 1);
        }
    };
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
            
            // Add animation to table
            const table = document.querySelector('.leaderboard-table');
            table.classList.add('fade-in');
            setTimeout(() => {
                table.classList.remove('fade-in');
            }, 1000);
        });
    });
}

/**
 * Set up event listeners for pagination buttons
 */
function setupPagination() {
    // Event listeners are added dynamically in updatePagination()
    console.log('Pagination setup complete');
}

/**
 * Add animations to the page elements
 */
function addAnimations() {
    // Add fade-in animation to the table
    const table = document.querySelector('.leaderboard-table');
    table.classList.add('fade-in');
    
    // Add hover effect to rows
    document.querySelectorAll('tr').forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.classList.add('glow');
        });
        
        row.addEventListener('mouseleave', () => {
            row.classList.remove('glow');
        });
    });
}