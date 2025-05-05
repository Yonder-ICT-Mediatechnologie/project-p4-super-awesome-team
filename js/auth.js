// Enhanced auth.js - Improved Authentication functionality for Hangman Game

document.addEventListener('DOMContentLoaded', function() {
    // Check which form we're on
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        addFormAnimations(loginForm);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
        addFormAnimations(registerForm);
        
        // Add password match validation
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                validatePasswordMatch(passwordInput, confirmPasswordInput);
            });
            
            passwordInput.addEventListener('input', function() {
                if (confirmPasswordInput.value) {
                    validatePasswordMatch(passwordInput, confirmPasswordInput);
                }
            });
        }
    }
    
    // Also handle logout if the logout link exists
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
    
    // Check if user is already logged in
    checkCurrentUser();
});

/**
 * Add animations to form elements
 */
function addFormAnimations(form) {
    const formGroups = form.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        // Add slide-in animation with increasing delay
        group.classList.add('slide-in');
        group.style.animationDelay = `${0.1 + (index * 0.1)}s`;
    });
}

/**
 * Validate password match
 */
function validatePasswordMatch(passwordInput, confirmPasswordInput) {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Passwords do not match");
        confirmPasswordInput.style.borderColor = 'var(--error-color)';
    } else {
        confirmPasswordInput.setCustomValidity('');
        confirmPasswordInput.style.borderColor = 'var(--success-color)';
    }
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember')?.checked || false;
    
    // Show loading state
    const submitButton = document.querySelector('.btn-login');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    // Basic validation
    if (!username || !password) {
        showNotification('Please enter both username and password.', 'error');
        resetButton(submitButton, originalButtonText);
        return;
    }
    
    // For Sprint 1, we'll check if the user exists in localStorage
    // In future sprints, this would be an API call
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('hangmanUsers')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Set the logged in user in localStorage
            localStorage.setItem('hangmanCurrentUser', JSON.stringify({
                username: user.username,
                email: user.email,
                id: users.indexOf(user) + 1, // Simple ID for tracking
                rememberMe: rememberMe
            }));
            
            // Show success message
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect to game page after a short delay
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 1000);
        } else {
            showNotification('Invalid username or password. Please try again.', 'error');
            resetButton(submitButton, originalButtonText);
            
            // Shake the form to indicate error
            const form = document.getElementById('login-form');
            form.classList.add('shake');
            setTimeout(() => {
                form.classList.remove('shake');
            }, 500);
        }
    }, 800); // Simulate network delay
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
    const acceptedTerms = document.getElementById('terms')?.checked || false;
    
    // Show loading state
    const submitButton = document.querySelector('.btn-register');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Creating account...';
    submitButton.disabled = true;
    
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields.', 'error');
        resetButton(submitButton, originalButtonText);
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        resetButton(submitButton, originalButtonText);
        return;
    }
    
    if (!acceptedTerms) {
        showNotification('You must accept the Terms of Service and Privacy Policy.', 'error');
        resetButton(submitButton, originalButtonText);
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        resetButton(submitButton, originalButtonText);
        return;
    }
    
    // Password strength validation
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        resetButton(submitButton, originalButtonText);
        return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
        // Get existing users or initialize empty array
        const users = JSON.parse(localStorage.getItem('hangmanUsers')) || [];
        
        // Check if username already exists
        if (users.some(user => user.username === username)) {
            showNotification('Username already exists. Please choose a different one.', 'error');
            resetButton(submitButton, originalButtonText);
            return;
        }
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            showNotification('Email already registered. Please use a different email or login.', 'error');
            resetButton(submitButton, originalButtonText);
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
            email,
            id: users.length, // Simple ID for tracking
            rememberMe: false
        }));
        
        // Show success message
        showNotification('Registration successful! Redirecting to game...', 'success');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1500);
        
    }, 1000); // Simulate network delay
}

/**
 * Handle logout
 */
function handleLogout(event) {
    event.preventDefault();
    
    // Show confirmation modal
    showConfirmation(
        'Logout',
        'Are you sure you want to logout?',
        'Yes, logout',
        'Cancel',
        () => {
            // Remove the current user from localStorage
            localStorage.removeItem('hangmanCurrentUser');
            
            // Show success message
            showNotification('You have been logged out successfully.', 'success');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                const isInPagesDirectory = window.location.pathname.includes('/pages/');
                if (isInPagesDirectory) {
                    window.location.href = '../index.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        }
    );
}

/**
 * Show a notification message
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (document.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Add notification styles if not already present
    if (!document.getElementById('notification-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'notification-styles';
        styleTag.textContent = `
            .notification {
                position: fixed;
                top: 1rem;
                right: 1rem;
                max-width: 300px;
                background-color: white;
                border-radius: 4px;
                padding: 0.75rem 1rem;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                transform: translateX(120%);
                transition: transform 0.3s ease;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                margin-right: 0.5rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #777;
            }
            
            .notification.success {
                border-left: 4px solid var(--success-color);
            }
            
            .notification.error {
                border-left: 4px solid var(--error-color);
            }
            
            .notification.info {
                border-left: 4px solid var(--primary-color);
            }
        `;
        document.head.appendChild(styleTag);
    }
}

/**
 * Show a confirmation dialog
 */
function showConfirmation(title, message, confirmText, cancelText, onConfirm) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    
    // Create modal content
    const modal = document.createElement('div');
    modal.classList.add('confirmation-modal');
    
    modal.innerHTML = `
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="modal-buttons">
            <button class="btn btn-cancel">${cancelText}</button>
            <button class="btn btn-confirm">${confirmText}</button>
        </div>
    `;
    
    // Add to document
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    // Show with animation
    setTimeout(() => {
        modalOverlay.classList.add('show');
        modal.classList.add('show');
    }, 10);
    
    // Add event listeners
    const confirmButton = modal.querySelector('.btn-confirm');
    const cancelButton = modal.querySelector('.btn-cancel');
    
    confirmButton.addEventListener('click', () => {
        closeModal();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    });
    
    cancelButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close modal function
    function closeModal() {
        modalOverlay.classList.remove('show');
        modal.classList.remove('show');
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }
    
    // Add modal styles if not already present
    if (!document.getElementById('modal-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'modal-styles';
        styleTag.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                transition: background-color 0.3s ease;
            }
            
            .modal-overlay.show {
                background-color: rgba(0, 0, 0, 0.5);
            }
            
            .confirmation-modal {
                background-color: white;
                border-radius: 8px;
                padding: 1.5rem;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                max-width: 90%;
                width: 400px;
                transform: scale(0.8);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .confirmation-modal.show {
                transform: scale(1);
                opacity: 1;
            }
            
            .confirmation-modal h3 {
                margin-top: 0;
                color: var(--primary-color);
            }
            
            .modal-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
                margin-top: 1.5rem;
            }
            
            .btn-cancel {
                background-color: #f1f1f1;
                color: #333;
            }
            
            .btn-confirm {
                background-color: var(--primary-color);
            }
        `;
        document.head.appendChild(styleTag);
    }
}

/**
 * Reset button state
 */
function resetButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}

/**
 * Check if user is logged in and handle redirections
 */
function checkCurrentUser() {
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    const isLoginPage = window.location.pathname.includes('login.html');
    const isRegisterPage = window.location.pathname.includes('register.html');
    const isAuthPage = isLoginPage || isRegisterPage;
    
    // Update UI for authenticated user
    if (currentUser) {
        const user = JSON.parse(currentUser);
        
        // If on login or register page, redirect to game
        if (isAuthPage) {
            window.location.href = 'game.html';
            return;
        }
        
        // Update avatar initial if on stats page
        const avatarInitial = document.getElementById('avatar-initial');
        if (avatarInitial) {
            avatarInitial.textContent = user.username.charAt(0).toUpperCase();
        }
    } else {
        // If not logged in and on a protected page
        const isProtectedPage = 
            window.location.pathname.includes('game.html') ||
            window.location.pathname.includes('stats.html') ||
            window.location.pathname.includes('leaderboard.html');
        
        if (isProtectedPage) {
            // Redirect to login
            window.location.href = 'login.html';
        }
    }
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