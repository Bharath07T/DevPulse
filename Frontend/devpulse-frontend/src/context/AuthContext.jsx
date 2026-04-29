import React, { useEffect, useState, createContext, useContext } from 'react'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if(savedUser) setUser(JSON.parse(savedUser));
    if(savedToken) setToken(savedToken);
    setLoading(false);
  }, []);

  const login = (userData, receivedToken) => {
    setUser(userData);
    setToken(receivedToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', receivedToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  const updateUser = (updateUser) => {
    setUser(updateUser);
    localStorage.setItem('user', JSON.stringify(updateUser));
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value = {{ user, token, login, logout, isAuthenticated, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);