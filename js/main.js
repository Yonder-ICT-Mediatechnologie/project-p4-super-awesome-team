// main.js - Main JavaScript for Hangman Game - Sprint 1

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('hangmanCurrentUser');
    
    // Update navigation based on authentication state
    updateNavigation(currentUser);
    
    // Add event listeners
    setupEventListeners();
});

/**
 * Update navigation based on user authentication state
 */
function updateNavigation(currentUser) {
    const navLinks = document.querySelector('nav ul');
    
    // Only update if nav exists on the page
    if (navLinks) {
        // For Sprint 1, we'll keep it simple
        // In future sprints, this will be more dynamic
        
        // If we're on the index page, show different nav depending on auth state
        if (window.location.pathname.endsWith('index.html') || 
            window.location.pathname.endsWith('/')) {
            
            if (currentUser) {
                // User is logged in
                navLinks.innerHTML = `
                    <li><a href="index.html">Home</a></li>
                    <li><a href="pages/game.html">Play</a></li>
                    <li><a href="pages/leaderboard.html">Leaderboard</a></li>
                    <li><a href="pages/stats.html">My Stats</a></li>
                    <li><a href="#" id="logout-link">Logout</a></li>
                `;
                
                // Add logout event listener
                const logoutLink = document.getElementById('logout-link');
                if (logoutLink) {
                    logoutLink.addEventListener('click', handleLogout);
                }
            }
        }
    }
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Logout functionality if the element exists
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
}

/**
 * Handle logout action
 */
function handleLogout(event) {
    event.preventDefault();
    
    // Clear user from localStorage
    localStorage.removeItem('hangmanCurrentUser');
    
    // Redirect to home page
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    if (isInPagesDirectory) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}
// Add this to your main.js file
document.addEventListener('DOMContentLoaded', function() {
    // Specific fix for logout functionality
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Clear the current user from localStorage
            localStorage.removeItem('hangmanCurrentUser');
            // Redirect to index.html
            window.location.href = 'index.html';
        });
    }
});

/**
 * Animation and visual effects research for future sprints
 * This function contains notes about the animation libraries considered for the project
 */
function animationNotes() {
    // For Sprint 1, we're researching animation options
    // These are the libraries we're considering:
    
    /*
    1. GSAP (GreenSock Animation Platform)
       - Pros: Powerful, smooth animations, great browser support
       - Cons: Commercial license for advanced features
       - Website: https://greensock.com/
       
    2. Anime.js
       - Pros: Lightweight, flexible, good for SVG animations
       - Cons: Less comprehensive than GSAP
       - Website: https://animejs.com/
       
    3. Mo.js
       - Pros: Great for motion graphics, unique effects
       - Cons: Steeper learning curve
       - Website: https://mojs.github.io/
       
    4. Lottie
       - Pros: Can use After Effects animations on web
       - Cons: Requires animation files created in After Effects
       - Website: https://airbnb.design/lottie/
       
    5. CSS Animations (no library)
       - Pros: No external dependencies, good browser support
       - Cons: Limited complexity, harder to sequence
       
    Decision for Sprint 2:
    For the Hangman game, we'll likely use a combination of CSS animations for simple effects
    and Anime.js for more complex animations like the hangman figure drawing and game transitions.
    */
}