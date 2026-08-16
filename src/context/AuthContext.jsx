import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('madrasa-user');
    const savedAuth = localStorage.getItem('madrasa-auth');
    
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const signIn = (email, password) => {
    // Simple authentication (no backend)
    // In production, this should be replaced with real authentication
    const users = JSON.parse(localStorage.getItem('madrasa-users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('madrasa-user', JSON.stringify(user));
      localStorage.setItem('madrasa-auth', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signUp = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('madrasa-users') || '[]');
    
    // Check if email exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('madrasa-users', JSON.stringify(users));
    
    // Auto sign in
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('madrasa-user', JSON.stringify(newUser));
    localStorage.setItem('madrasa-auth', 'true');
    
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('madrasa-user');
    localStorage.removeItem('madrasa-auth');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}