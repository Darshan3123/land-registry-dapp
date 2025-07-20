// Session management utility
export const SessionManager = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  // Get current user session
  getCurrentUser: () => {
    const userSession = localStorage.getItem('userSession');
    return userSession ? JSON.parse(userSession) : null;
  },

  // Set user session
  setUserSession: (userData) => {
    localStorage.setItem('userSession', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  },

  // Clear user session (logout)
  clearSession: () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('isAuthenticated');
  },

  // Get user role
  getUserRole: () => {
    const user = SessionManager.getCurrentUser();
    return user ? user.role : null;
  },

  // Check if user has specific role
  hasRole: (requiredRole) => {
    const userRole = SessionManager.getUserRole();
    return userRole === requiredRole;
  }
};

export default SessionManager;
