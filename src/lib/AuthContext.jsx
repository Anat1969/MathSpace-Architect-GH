import React, { createContext, useContext } from 'react';

// The app is now a public static site — there is no backend and no login.
// This provider keeps the same shape the rest of the app consumes, but reports
// "ready, not signed in" immediately so the UI renders without any auth gate.

const AuthContext = createContext();

const VALUE = {
  user: null,
  isAuthenticated: false,
  isLoadingAuth: false,
  isLoadingPublicSettings: false,
  authChecked: true,
  authError: null,
  appPublicSettings: null,
  logout: () => {},
  navigateToLogin: () => {},
  checkUserAuth: () => {},
  checkAppState: () => {},
};

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={VALUE}>{children}</AuthContext.Provider>
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
