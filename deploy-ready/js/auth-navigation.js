// Authentication and navigation utilities

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Get user role
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Get user ID
function getUserId() {
    return localStorage.getItem('userId');
}

// Update navigation based on authentication state
function updateNavigation() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Update all navigation elements across the site
    const loginLinks = document.querySelectorAll('#login-link, .login-link');
    const registerLinks = document.querySelectorAll('#register-link, .register-link');
    const dashboardLinks = document.querySelectorAll('#dashboard-link, .dashboard-link');
    const producerDashboardLinks = document.querySelectorAll('#producer-dashboard-link, .producer-dashboard-link');
    const producerOrdersLinks = document.querySelectorAll('#producer-orders-link, .producer-orders-link');
    const logoutBtns = document.querySelectorAll('#logout-btn, .logout-btn');

    loginLinks.forEach(link => {
        if (link) link.style.display = token ? 'none' : 'inline';
    });

    registerLinks.forEach(link => {
        if (link) link.style.display = token ? 'none' : 'inline';
    });

    dashboardLinks.forEach(link => {
        if (link) {
            link.style.display = token ? 'inline' : 'none';
            if (userRole === 'producteur') {
                link.textContent = 'Tableau de bord Producteur';
                link.href = 'dashboard.html?role=producer';
            } else {
                link.textContent = 'Mon compte';
                link.href = 'dashboard.html?role=consumer';
            }
        }
    });

    producerDashboardLinks.forEach(link => {
        if (link) link.style.display = (token && userRole === 'producteur') ? 'inline' : 'none';
    });

    producerOrdersLinks.forEach(link => {
        if (link) link.style.display = (token && userRole === 'producteur') ? 'inline' : 'none';
    });

    logoutBtns.forEach(btn => {
        if (btn) btn.style.display = token ? 'inline' : 'none';
    });
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    updateNavigation();
    window.location.href = 'index.html';
}

// Protect routes that require authentication
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Protect producer routes
function requireProducer() {
    if (!isAuthenticated() || getUserRole() !== 'producer') {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function () {
    updateNavigation();
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isAuthenticated,
        getUserRole,
        getUserId,
        updateNavigation,
        logout,
        requireAuth,
        requireProducer
    };
}
