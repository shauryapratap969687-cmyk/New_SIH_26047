import type { DoctorSession } from '../types';

export interface AuthContextType {
  isAuthenticated: boolean;
  doctor: DoctorSession | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}
