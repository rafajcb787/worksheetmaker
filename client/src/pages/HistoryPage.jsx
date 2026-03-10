import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import WorksheetPreview from "../components/WorksheetPreview.jsx";

export default function HistoryPage() {
  const { t } = useTranslation();
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  const [worksheets, setWorksheets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorksheets();
  }, []);

  const fetchWorksheets = async () => {
    try {
      const res = await authFetch("/api/worksheets");
      const data = await res.json();
      setWorksheets(data);
    } catch (err) {
      console.error("Failed to fetch worksheets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("history.confirmDelete"))) return;

    try {
      await authFetch(`/api/worksheets/${id}`, { method: "DELETE" });
      setWorksheets((prev) => prev.filter((w) => w.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("history.title")}</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          {t("history.newWorksheet")}
        </button>
      </div>

      {worksheets.length === 0 ? (
        <div className="text-center text-gray-400 py-16">{t("history.empty")}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">{t("history.worksheetTitle")}</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">{t("history.grade")}</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">{t("history.language")}</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">{t("history.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {worksheets.map((ws) => (
                    <tr
                      key={ws.id}
                      className={`border-b hover:bg-gray-50 cursor-pointer ${selected?.id === ws.id ? "bg-indigo-50" : ""}`}
                      onClick={() => setSelected(ws)}
                    >
                      <td className="px-4 py-3 font-medium truncate max-w-[150px]">{ws.title}</td>
                      <td className="px-4 py-3 text-gray-500">{ws.gradeLevel}</td>
                      <td className="px-4 py-3 text-gray-500 uppercase">{ws.contentLanguage}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(ws.id); }}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          {t("history.delete")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-5 min-h-[400px]">
              <WorksheetPreview worksheet={selected} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
