import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import AuthProvider from './components/auth/AuthProvider';
import { useAuthStore } from './store/authStore';
import { DashboardPage } from './pages/DashboardPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { FamilyWelfarePage } from './pages/FamilyWelfarePage';
import { MissedOpportunitiesPage } from './pages/MissedOpportunitiesPage';
import { SchemePage } from './pages/SchemePage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500/30 border-t-cyan-500" />
        <p className="text-white/50 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthStore();

  if (loading) {
    return <LoadingFallback />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
              <Route path="/assistant/:id" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
              <Route path="/schemes" element={<ProtectedRoute><SchemePage /></ProtectedRoute>} />
              <Route path="/schemes/:id" element={<ProtectedRoute><SchemeDetailPage /></ProtectedRoute>} />
              <Route path="/family" element={<ProtectedRoute><FamilyWelfarePage /></ProtectedRoute>} />
              <Route path="/opportunities" element={<ProtectedRoute><MissedOpportunitiesPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
