// api.js - API connection functions for Hangman Game - Sprint 1
// This file contains placeholders for API calls that will be implemented in future sprints

// Base URL for the API
// This should be configurable for different environments (development, testing, production)
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Authentication API calls
 */
const authAPI = {
    /**
     * Login user
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise} - Promise resolving to the user data
     */
    login: async function(username, password) {
        // This is a placeholder for Sprint 1
        console.log('API login call would happen here with:', { username, password });
        
        // Simulate API response for Sprint 1
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        username: username,
                        email: 'user@example.com'
                    },
                    token: 'sample-jwt-token'
                });
            }, 500);
        });
    },
    
    /**
     * Register a new user
     * @param {object} userData - User registration data
     * @returns {Promise} - Promise resolving to the new user data
     */
    register: async function(userData) {
        // This is a placeholder for Sprint 1
        console.log('API register call would happen here with:', userData);
        
        // Simulate API response for Sprint 1
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: 2,
                        username: userData.username,
                        email: userData.email
                    },
                    token: 'sample-jwt-token'
                });
            }, 500);
        });
    },
    
    /**
     * Logout the current user
     * @returns {Promise} - Promise resolving to the logout status
     */
    logout: async function() {
        // This is a placeholder for Sprint 1
        console.log('API logout call would happen here');
        
        // Simulate API response for Sprint 1
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true
                });
            }, 200);
        });
    }
};

/**
 * Game API calls
 */
const gameAPI = {
    /**
     * Get a random word for the game
     * @returns {Promise} - Promise resolving to a word object
     */
    getRandomWord: async function() {
        // This is a placeholder for Sprint 1
        console.log('API get random word call would happen here');
        
        // Simulate API response for Sprint 1
        const words = ['HANGMAN', 'JAVASCRIPT', 'PROJECT', 'DEVELOPMENT', 'SPRINT'];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    word: {
                        id: 1,
                        text: randomWord,
                        category: 'programming'
                    }
                });
            }, 300);
        });
    },
    
    /**
     * Save game score
     * @param {object} scoreData - Score data to save
     * @returns {Promise} - Promise resolving to the saved score
     */
    saveScore: async function(scoreData) {
        // This is a placeholder for Sprint 1
        console.log('API save score call would happen here with:', scoreData);
        
        // Simulate API response for Sprint 1
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    score: {
                        id: 1,
                        userId: scoreData.userId,
                        word: scoreData.word,
                        attempts: scoreData.attempts,
                        time: scoreData.time,
                        date: new Date().toISOString()
                    }
                });
            }, 300);
        });
    },
    
    /**
     * Get user high scores
     * @param {number} userId - User ID
     * @returns {Promise} - Promise resolving to the user's scores
     */
    getUserScores: async function(userId) {
        // This is a placeholder for Sprint 1
        console.log('API get user scores call would happen here for user:', userId);
        
        // Simulate API response for Sprint 1
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    scores: [
                        {
                            id: 1,
                            word: 'JAVASCRIPT',
                            attempts: 2,
                            time: 45,
                            date: '2025-04-07T12:00:00Z'
                        },
                        {
                            id: 2,
                            word: 'HANGMAN',
                            attempts: 1,
                            time: 30,
                            date: '2025-04-06T14:30:00Z'
                        }
                    ]
                });
            }, 300);
        });
    },
    
    /**
     * Get leaderboard data
     * @param {string} timeframe - Timeframe for the leaderboard (today, yesterday, alltime)
     * @returns {Promise} - Promise resolving to the leaderboard data
     */
    getLeaderboard: async function(timeframe = 'alltime') {
        // This is a placeholder for Sprint 1
        console.log('API get leaderboard call would happen here for timeframe:', timeframe);
        
        // Simulate API response for Sprint 1
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    leaderboard: [
                        {
                            username: 'player1',
                            score: 120,
                            gamesPlayed: 10
                        },
                        {
                            username: 'player2',
                            score: 95,
                            gamesPlayed: 8
                        },
                        {
                            username: 'player3',
                            score: 85,
                            gamesPlayed: 7
                        }
                    ]
                });
            }, 300);
        });
    }
};

// Export the API modules
const API = {
    auth: authAPI,
    game: gameAPI
};