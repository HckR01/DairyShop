"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser({
              id: data._id || data.id,
              name: data.name,
              email: data.email,
              role: data.role || "user",
              phone: data.phone || "",
              address: data.address || "",
            });
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data._id || data.id,
          name: data.name,
          email: data.email,
          role: data.role || "user",
          phone: data.phone || "",
          address: data.address || "",
        });
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data._id || data.id,
          name: data.name,
          email: data.email,
          role: data.role || "user",
        });
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token || !user) return false;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setUser({ ...user, ...data });
        return true;
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
