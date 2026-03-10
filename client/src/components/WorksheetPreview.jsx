import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function WorksheetPreview({ worksheet }) {
  const { t } = useTranslation();
  const printRef = useRef(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head><title>${worksheet?.title || "Worksheet"}</title>
        <style>body { font-family: Arial, sans-serif; padding: 20px; }</style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${worksheet?.title || "worksheet"}.pdf`);
  };

  if (!worksheet) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        {t("preview.placeholder")}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{t("preview.title")}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            {t("preview.print")}
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            {t("preview.downloadPdf")}
          </button>
        </div>
      </div>

      <div
        ref={printRef}
        className="worksheet-content bg-white border border-gray-200 rounded-md p-6 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: worksheet.content }}
      />

      {worksheet.answerKey && (
        <div className="mt-4">
          <button
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showAnswerKey ? t("preview.hideAnswerKey") : t("preview.showAnswerKey")}
          </button>
          {showAnswerKey && (
            <div
              className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md p-4 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: worksheet.answerKey }}
            />
          )}
        </div>
      )}
    </div>
  );
}
