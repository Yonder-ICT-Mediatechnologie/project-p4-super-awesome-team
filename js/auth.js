// auth.js - Authentication functionality for Hangman Game - Sprint 1

// For Sprint 1, we'll use local storage to simulate authentication
// In future sprints, this will be replaced with API calls to the backend

document.addEventListener('DOMContentLoaded', function() {
    // Check which form we're on
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Also handle logout if the logout link exists
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
});

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }
    
    // For Sprint 1, we'll check if the user exists in localStorage
    const users = JSON.parse(localStorage.getItem('hangmanUsers')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Set the logged in user in localStorage
        localStorage.setItem('hangmanCurrentUser', JSON.stringify({
            username: user.username,
            email: user.email
        }));
        
        // Redirect to game page
        window.location.href = 'game.html';
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

/**
 * Handle registration form submission
 */
function handleRegistration(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('hangmanUsers')) || [];
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists. Please choose a different one.');
        return;
    }
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert('Email already registered. Please use a different email or login.');
        return;
    }
    
    // Add new user
    users.push({
        username,
        email,
        password,
        dateRegistered: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('hangmanUsers', JSON.stringify(users));
    
    // Auto-login the new user
    localStorage.setItem('hangmanCurrentUser', JSON.stringify({
        username,
        email
    }));
    
    // Show success message and redirect
    alert('Registration successful! You are now logged in.');
    window.location.href = 'game.html';
}

/**
 * Handle logout
 */
function handleLogout(event) {
    event.preventDefault();
    
    // Remove the current user from localStorage
    localStorage.removeItem('hangmanCurrentUser');
    
    // Redirect to home page
    window.location.href = '../index.html';
}

/**
 * Check if user is logged in
 * This can be used on pages that require authentication
 */
function checkAuth() {
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
    }
    
    return JSON.parse(currentUser);
}