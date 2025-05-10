
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, users } from "../lib/mockData";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        
        // Validate that this user still exists in our users array
        // This prevents issues if the mock data changes
        const validUser = users.find(u => u.id === user.id && u.email === user.email);
        
        if (validUser) {
          setCurrentUser(validUser);
          setIsAdmin(validUser.role === 'admin');
        } else {
          // Clear invalid user data
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsInitialized(true);
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success("Login successful!");
      return true;
    } else {
      toast.error("Invalid email or password");
      return false;
    }
  };

  const register = (name: string, email: string, password: string): boolean => {
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      toast.error("Email already exists");
      return false;
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      password,
      role: 'customer' // New users are always customers
    };
    
    users.push(newUser);
    setCurrentUser(newUser);
    setIsAdmin(false);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    toast.success("Registration successful!");
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('currentUser');
    toast.success("Logged out successfully!");
  };

  // Only render children when we've checked local storage
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
