import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlanProvider } from './context/PlanContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PlanPage from './pages/PlanPage';
// import TasksPage from './pages/TasksPage';
import NotesPage from './pages/NotesPage';
import TestsPage from './pages/TestsPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import CreatePlanPage from './pages/CreatePlanPage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlanProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/create-plan" element={
                <ProtectedRoute>
                  <CreatePlanPage />
                </ProtectedRoute>
              } />
              
              <Route path="/plan" element={
                <ProtectedRoute>
                  <PlanPage />
                </ProtectedRoute>
              } />
              
              {/* <Route path="/tasks" element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              } /> */}
              
              <Route path="/notes" element={
                <ProtectedRoute>
                  <NotesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/tests" element={
                <ProtectedRoute>
                  <TestsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/wallet" element={
                <ProtectedRoute>
                  <WalletPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </PlanProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;