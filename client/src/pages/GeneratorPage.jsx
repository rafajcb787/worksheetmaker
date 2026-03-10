import { useState } from "react";
import WorksheetForm from "../components/WorksheetForm.jsx";
import WorksheetPreview from "../components/WorksheetPreview.jsx";

export default function GeneratorPage() {
  const [worksheet, setWorksheet] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-5 sticky top-6">
            <WorksheetForm onGenerated={setWorksheet} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-5 min-h-[600px]">
            <WorksheetPreview worksheet={worksheet} />
          </div>
        </div>
      </div>
    </div>
  );
}
