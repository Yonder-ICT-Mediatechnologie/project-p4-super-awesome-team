// Database-powered Authentication for Hangman Game - NO LOCAL STORAGE

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
    
    // Check if user session is valid
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
        confirmPasswordInput.style.borderColor = '#e74c3c';
    } else {
        confirmPasswordInput.setCustomValidity('');
        confirmPasswordInput.style.borderColor = '#2DCE89';
    }
}

/**
 * Handle login form submission - DATABASE ONLY
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMeCheckbox = document.getElementById('remember-me');
    const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;
    
    // Show loading state
    const submitButton = event.target.querySelector('.btn, button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    // Basic validation
    if (!username || !password) {
        showNotification('Please enter both username and password.', 'error');
        resetButton(submitButton, originalButtonText);
        return;
    }
    
    // Send login request to DATABASE API
    fetch('../api/auth.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'login',
            username: username,
            password: password,
            rememberMe: rememberMe
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get response text first to see what we're getting
        return response.text();
    })
    .then(text => {
        console.log('Raw response:', text);
        
        // Try to parse as JSON
        try {
            const data = JSON.parse(text);
            
            if (data.success) {
                // Store ONLY session token and user info for current session
                localStorage.setItem('hangmanSessionToken', data.sessionToken);
                localStorage.setItem('hangmanCurrentUser', JSON.stringify(data.user));
                
                showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect to game page after a short delay
                setTimeout(() => {
                    window.location.href = 'game.html';
                }, 1000);
            } else {
                showNotification(data.message || 'Login failed. Please try again.', 'error');
                resetButton(submitButton, originalButtonText);
            }
        } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            console.log('Response was not valid JSON:', text);
            showNotification('Server returned invalid response. Please try again.', 'error');
            resetButton(submitButton, originalButtonText);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showNotification('Login failed. Please check your connection and try again.', 'error');
        resetButton(submitButton, originalButtonText);
    });
}

/**
 * Handle registration form submission - DATABASE ONLY
 */
function handleRegistration(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const acceptedTerms = document.getElementById('terms')?.checked || false;
    
    // Show loading state
    const submitButton = event.target.querySelector('.btn, button[type="submit"]');
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
    
    // Send registration request to DATABASE API
    fetch('../api/auth.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'register',
            username: username,
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Registration successful! Please login with your credentials.', 'success');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showNotification(data.message || 'Registration failed. Please try again.', 'error');
            resetButton(submitButton, originalButtonText);
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please check your connection and try again.', 'error');
        resetButton(submitButton, originalButtonText);
    });
}

/**
 * Handle logout - DATABASE SESSION CLEANUP
 */
function handleLogout(event) {
    event.preventDefault();
    
    const sessionToken = localStorage.getItem('hangmanSessionToken');
    
    // Send logout request to DATABASE API to invalidate session
    if (sessionToken) {
        fetch('../api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'logout',
                sessionToken: sessionToken
            })
        })
        .then(response => response.json())
        .then(data => {
            // Clear session storage (NOT user accounts)
            localStorage.removeItem('hangmanSessionToken');
            localStorage.removeItem('hangmanCurrentUser');
            
            showNotification('Logged out successfully!', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        })
        .catch(error => {
            console.error('Logout error:', error);
            // Clear session storage even on error
            localStorage.removeItem('hangmanSessionToken');
            localStorage.removeItem('hangmanCurrentUser');
            
            showNotification('Logged out successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        });
    } else {
        // Just clear session storage and redirect
        localStorage.removeItem('hangmanSessionToken');
        localStorage.removeItem('hangmanCurrentUser');
        
        showNotification('Logged out successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';
    
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.innerHTML = getNotificationIcon(type);
    
    const messageEl = document.createElement('span');
    messageEl.className = 'notification-message';
    messageEl.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => hideNotification(notification));
    
    notificationContent.appendChild(icon);
    notificationContent.appendChild(messageEl);
    notificationContent.appendChild(closeButton);
    notification.appendChild(notificationContent);
    
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'i'
    };
    return icons[type] || icons.info;
}

/**
 * Hide notification
 */
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Reset button state
 */
function resetButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}

/**
 * Check if user session is valid with DATABASE verification
 */
function checkCurrentUser() {
    const sessionToken = localStorage.getItem('hangmanSessionToken');
    
    if (!sessionToken) {
        return; // No session token, user not logged in
    }
    
    // Verify session with DATABASE
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
            // Update user data for current session
            localStorage.setItem('hangmanCurrentUser', JSON.stringify(data.user));
            console.log('User session verified:', data.user.username);
        } else {
            // Session invalid, clear session storage
            localStorage.removeItem('hangmanSessionToken');
            localStorage.removeItem('hangmanCurrentUser');
        }
    })
    .catch(error => {
        console.error('Session verification error:', error);
        // On error, clear potentially invalid session
        localStorage.removeItem('hangmanSessionToken');
        localStorage.removeItem('hangmanCurrentUser');
    });
}

/**
 * Check authentication for protected pages - DATABASE ONLY
 */
function checkAuth() {
    const sessionToken = localStorage.getItem('hangmanSessionToken');
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    
    if (!sessionToken || !currentUser) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return false;
    }
    
    // Verify session is still valid with database
    checkCurrentUser();
    return true;
}

/**
 * Clean up any old localStorage data that might be left from previous versions
 */
function cleanupOldData() {
    // Remove old localStorage user accounts (we only use database now)
    localStorage.removeItem('hangmanUsers');
    localStorage.removeItem('isLoggedIn');
    
    // Keep only session-related data
    // hangmanSessionToken and hangmanCurrentUser are kept for current session
}

// Clean up old data on load
document.addEventListener('DOMContentLoaded', cleanupOldData);