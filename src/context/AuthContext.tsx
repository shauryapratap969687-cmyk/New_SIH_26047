import React, { useState, useEffect } from 'react';
import type { DoctorSession } from '../types';
import { storageService, DEMO_DOCTOR } from '../services/storage';
import { AuthContext } from './authContextInstance';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctor, setDoctor] = useState<DoctorSession | null>(() => {
    return storageService.getSession();
  });

  useEffect(() => {
    storageService.init();
  }, []);

  const login = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanEmail === 'doctor@ayush.demo' && cleanPass === 'Ayush@123') {
      const sessionData: DoctorSession = {
        ...DEMO_DOCTOR,
        loginTime: new Date().toISOString(),
      };
      storageService.setSession(sessionData);
      setDoctor(sessionData);
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Invalid credentials. Please use the demo credentials provided below.',
      };
    }
  };

  const logout = () => {
    storageService.clearSession();
    setDoctor(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!doctor,
        doctor,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
