import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockUsers } from '../utils/mockData';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('aiClassroomUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('aiClassroomUser', JSON.stringify(user));
      return true;
    }

    return false;
  };

  const signup = async (username, email, password) => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
    };

    mockUsers.push(newUser);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('aiClassroomUser', JSON.stringify(newUser));

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('aiClassroomUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
