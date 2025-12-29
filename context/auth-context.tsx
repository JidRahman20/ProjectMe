"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string; // kept as string for compatibility (Prisma uses Int internally)
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string }>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get home page based on role
function getHomeByRole(role: string): string {
  const roleMap: Record<string, string> = {
    'approval': '/approval',
    'admin': '/admin', // admin langsung ke admin dashboard
    'pendor': '/pendor',
    'user': '/user',
    'ADMIN': '/admin', // uppercase variant
  }
  return roleMap[role.toLowerCase()] || '/user'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectTo?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Penting untuk mengirim/menerima cookies
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) return { success: false }
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        const redirectTo = getHomeByRole(data.user.role)
        return { success: true, redirectTo }
      }
      return { success: false }
    } catch (e) {
      console.error('Login failed', e)
      return { success: false }
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      if (!res.ok) return false
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        return true
      }
      return false
    } catch (e) {
      console.error('Register failed', e)
      return false
    }
  }

  const logout = async () => {
    try {
      // Panggil API logout untuk menghapus cookie di server
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    // Hapus data user dari state dan localStorage
    setUser(null);
    localStorage.removeItem("user");
    
    // Hapus semua cookies di client side
    if (typeof document !== 'undefined') {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
    
    // Redirect ke halaman login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
