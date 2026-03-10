import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Header from "./components/Header.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import GeneratorPage from "./pages/GeneratorPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {token && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/" element={<ProtectedRoute><GeneratorPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
