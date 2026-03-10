import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.startsWith("es") ? "es" : "en";

  const toggle = () => {
    i18n.changeLanguage(currentLang === "en" ? "es" : "en");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
      title="Toggle UI Language"
    >
      <span className={currentLang === "en" ? "font-bold text-indigo-600" : "text-gray-400"}>EN</span>
      <span className="text-gray-300">|</span>
      <span className={currentLang === "es" ? "font-bold text-indigo-600" : "text-gray-400"}>ES</span>
    </button>
  );
}
