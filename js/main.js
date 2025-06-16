// main.js - Global functionality for Hangman Game

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Global script loaded');
    
    // Initialize global features
    initializeNavigation();
    initializeLogout();
    initializeTheme();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Add active class to current page navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes(currentPage) || 
                    (currentPage === 'index.html' && href === 'index.html'))) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize logout functionality
 */
function initializeLogout() {
    const logoutLinks = document.querySelectorAll('#logout-link, .logout-btn');
    
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            handleLogout();
        });
    });
}

/**
 * Handle user logout
 */
function handleLogout() {
    // Clear user data
    localStorage.removeItem('hangmanCurrentUser');
    
    // Show logout message
    console.log('👋 User logged out');
    
    // Redirect to home page
    const isInSubDirectory = window.location.pathname.includes('pages/');
    if (isInSubDirectory) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

/**
 * Initialize theme and visual preferences
 */
function initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('hangmanTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduce-motion');
    }
}

/**
 * Utility function to show notifications
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

/**
 * Utility function to check if user is logged in
 */
function getCurrentUser() {
    const userData = localStorage.getItem('hangmanCurrentUser');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Utility function to format timestamps
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Export functions for use in other scripts
window.HangmanGlobal = {
    showNotification,
    getCurrentUser,
    formatTimestamp,
    handleLogout
};

console.log('✅ Global utilities loaded');