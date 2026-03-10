import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

export default function Header() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="no-print bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          {t("app.title")}
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm font-medium px-3 py-1.5 rounded ${
              location.pathname === "/" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("header.generate")}
          </Link>
          <Link
            to="/history"
            className={`text-sm font-medium px-3 py-1.5 rounded ${
              location.pathname === "/history" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("header.history")}
          </Link>

          <LanguageToggle />

          <span className="text-sm text-gray-500">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            {t("header.logout")}
          </button>
        </nav>
      </div>
    </header>
  );
}
