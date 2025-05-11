
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
    // First, check if we have registered users in localStorage
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      try {
        // Merge registered users with our mock data
        const parsedUsers = JSON.parse(storedUsers);
        
        // Only add users that don't already exist in the users array
        parsedUsers.forEach((user: User) => {
          const existingUser = users.find(u => u.email === user.email);
          if (!existingUser) {
            users.push(user);
          }
        });
      } catch (error) {
        console.error("Error parsing stored users:", error);
      }
    }
    
    // Then check for the current user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        
        // Validate that this user exists in our users array
        // This will now include both mock users and registered users
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
    
    // Add to users array
    users.push(newUser);
    
    // Store registered users in localStorage for persistence
    const storedUsers = localStorage.getItem('registeredUsers');
    let registeredUsers: User[] = [];
    
    if (storedUsers) {
      try {
        registeredUsers = JSON.parse(storedUsers);
      } catch (error) {
        console.error("Error parsing stored users:", error);
      }
    }
    
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Set as current user
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
