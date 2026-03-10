import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">{t("app.title")}</h1>
          <p className="text-gray-500">{t("auth.welcome")}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.name")}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isLogin ? t("auth.login") : t("auth.register")}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {isLogin ? t("auth.signUp") : t("auth.signIn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
