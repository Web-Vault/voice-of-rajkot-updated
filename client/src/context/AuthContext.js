import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, isAuthenticated, logout } from '../services/authService';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [isLoggedIn, setIsLoggedIn] = useState(false);

      // Initialize auth state on component mount
      useEffect(() => {
            const initAuth = () => {
                  try {
                        const loggedIn = isAuthenticated();
                        setIsLoggedIn(loggedIn);

                        if (loggedIn) {
                              const currentUser = getCurrentUser();
                              setUser(currentUser);
                        }
                  } catch (error) {
                        console.error('Error initializing auth:', error);
                  } finally {
                        setLoading(false);
                  }
            };

            initAuth();
      }, []);

      // Update auth state after login
      const updateAuthState = () => {
            const loggedIn = isAuthenticated();
            setIsLoggedIn(loggedIn);

            if (loggedIn) {
                  const currentUser = getCurrentUser();
                  setUser(currentUser);
            } else {
                  setUser(null);
            }
      };

      // Handle logout
      const handleLogout = () => {
            logout();
            setUser(null);
            setIsLoggedIn(false);
      };

      // Context value
      const value = {
            user,
            isLoggedIn,
            loading,
            updateAuthState,
            logout: handleLogout,
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
            throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
};

export default AuthContext;