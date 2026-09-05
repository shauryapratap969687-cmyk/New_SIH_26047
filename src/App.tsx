import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddPatientPage } from './pages/AddPatientPage';
import { CaseTakingPage } from './pages/CaseTakingPage';
import { SavedCasesPage } from './pages/SavedCasesPage';
import { CaseDetailPage } from './pages/CaseDetailPage';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/new"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AddPatientPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cases/new"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CaseTakingPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cases/edit/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CaseTakingPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cases"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SavedCasesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cases/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CaseDetailPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
