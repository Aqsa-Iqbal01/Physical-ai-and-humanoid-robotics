import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the user object
interface SoftwareBackground {
  experience_level: 'beginner' | 'intermediate' | 'expert' | 'none';
  programming_languages: string[];
  ai_experience: string;
}

interface HardwareBackground {
  gpu_availability: string;
  electronics_knowledge: string;
  microcontroller_experience: string[];
}

interface User {
  id: string;
  email: string;
  metadata?: {
    software_background?: SoftwareBackground;
    hardware_background?: HardwareBackground;
  };
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (accessToken: string) => Promise<void>; // Modified to accept token
  logout: () => void;
}

// Create the context with a default null value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the application and provide auth context
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // New loading state for initial token check

  // Check for existing token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      fetchUserDetails(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async (accessToken: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Clear token if it's invalid
      localStorage.removeItem('accessToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    await fetchUserDetails(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <div>Loading authentication...</div>; // Or a proper loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

