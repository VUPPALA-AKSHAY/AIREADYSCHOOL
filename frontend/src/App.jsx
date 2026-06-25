import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import { Agentation } from 'agentation';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chat = lazy(() => import('./pages/Chat'));
const KaggleImport = lazy(() => import('./pages/KaggleImport'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));

const PageFallback = () => (
  <div className="flex flex-1 items-center justify-center bg-surface-container-lowest p-6 text-primary">
    <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
  </div>
);

const AuthLoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-6">
    <div className="w-full max-w-md rounded-3xl border border-outline-variant/40 bg-surface/80 p-8 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Signing you in</p>
          <p className="mt-1 text-sm text-on-surface-variant">Preparing your dashboard and workspace data.</p>
        </div>
      </div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-outline-variant/30">
        <div className="h-full w-1/2 rounded-full bg-primary/80 animate-pulse" />
      </div>
    </div>
  </div>
);

function AppContent() {
  const { user, login, isWorkspaceLoading } = useApp();

  if (user && isWorkspaceLoading) {
    return <AuthLoadingScreen />;
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>

        <Route path="/login" element={<Login onLogin={login} />} />

        <Route
          path="/*"
          element={
            user ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Navigate to="/" />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/kaggle" element={<KaggleImport />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  const showAgentation =
    import.meta.env.DEV && import.meta.env.VITE_ENABLE_AGENTATION === 'true';

  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>

      {showAgentation && (
        <Agentation
          endpoint="http://localhost:4747"
          onSessionCreated={(sessionId) =>
            console.log('[Agentation] Session started:', sessionId)
          }
          onAnnotationAdd={(a) =>
            console.log('[Agentation] Annotation added:', a)
          }
          onSubmit={(annotations) =>
            console.log('[Agentation] Annotations sent:', annotations)
          }
        />
      )}
    </AppProvider>
  );
}

export default App;
