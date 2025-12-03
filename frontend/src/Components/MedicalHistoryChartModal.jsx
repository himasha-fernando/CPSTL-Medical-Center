import React from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

export default function MedicalHistoryChartModal({
  visible,
  onClose,
  history,
  fieldName,
  index,
  goPrev,
  goNext,
}) {
  if (!visible) return null;

  // Number of records to compare
  const RECORDS_TO_COMPARE = 5;

  // Slice the last RECORDS_TO_COMPARE records starting from index
  const chartRecords = history
    .slice(index, index + RECORDS_TO_COMPARE)
    .reverse(); // Reverse to show oldest - newest left-to-right

  const labels = chartRecords.map((rec) =>
    rec.visitDate ? new Date(rec.visitDate).toLocaleDateString() : "No Data"
  );

  const dataValues = chartRecords.map((rec) =>
    rec[fieldName] != null ? rec[fieldName] : null
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: fieldName.toUpperCase(),
        data: dataValues,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg max-w-full">
        <h2 className="text-lg font-bold mb-3">
          {fieldName} Comparison (Last {chartRecords.length} Visits)
        </h2>

        <Line data={chartData} />

        <div className="flex justify-between mt-4">
          <button
            onClick={goPrev}
            disabled={index + RECORDS_TO_COMPARE >= history.length}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Older
          </button>

          <button
            onClick={goNext}
            disabled={index === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Newer →
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
