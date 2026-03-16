import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "react-circular-progressbar/dist/styles.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Step3Report = ({ report }) => {
  // 1. Loading State (Polished)
  if (!report) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-full w-full animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
        </div>
        <p className="animate-pulse text-sm font-medium text-gray-500">
            Report Submitted go and view in history ....
        </p>
      </div>
    );
  }
  const navigate = useNavigate();

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((item, index) => ({
    name: `Question ${index + 1}`,
    score: item.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];
  let perfomanceText = "";
  let shortTagLine = "";

  if (finalScore >= 8) {
    perfomanceText = "Ready for job opportunities";
    shortTagLine = "Excellent Clarity and Structured responses";
  } else if (finalScore >= 5) {
    perfomanceText = "Need minor improvement before interview";
    shortTagLine = "Good foundation,refine articulation";
  } else {
    perfomanceText = "Significant improvement required";
    shortTagLine = "Work on clarity and confidence";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {

  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Title
  doc.setFontSize(18);
  doc.text("Interview Performance Report", pageWidth / 2, 20, {
    align: "center",
  });

  // Overall Scores
  doc.setFontSize(12);

  doc.text(`Final Score: ${finalScore}/10`, margin, 40);
  doc.text(`Confidence: ${confidence}/10`, margin, 48);
  doc.text(`Communication: ${communication}/10`, margin, 56);
  doc.text(`Correctness: ${correctness}/10`, margin, 64);

  // Table Data
  const tableColumn = [
    "Question",
    "Score",
    "Confidence",
    "Communication",
    "Correctness",
    "Feedback",
  ];

  const tableRows = questionWiseScore.map((q, i) => [
    `Q${i + 1}`,
    q.score || 0,
    q.confidence || 0,
    q.communication || 0,
    q.correctness || 0,
    q.feedback || "",
  ]);

  autoTable(doc, {
    startY: 80,
    head: [tableColumn],
    body: tableRows,

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [236, 72, 153], // pink
      textColor: 255,
    },

    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  });

  doc.save("Interview_Report.pdf");
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-100 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        {/* Left Section */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate("/history")}
            className="p-3 rounded-full bg-white shadow hover:shadow-md transition text-gray-600"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              Interview Analytics Dashboard
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-1">
              AI-powered performance insights
            </p>
          </div>
        </div>

        {/* Download Button */}
        <button onClick={downloadPDF}
        className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-sm sm:text-base">
          Download PDF
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center"
          >
            {" "}
            <h3>Overall Performance</h3>
            <div className="relative w-20 h-20 sm:w-25 sm:h-25 mx-auto mt-3 ">
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "#FF2E9F",
                  textColor: "#ef4444",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
            <div className="mt-4">
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                {perfomanceText}
              </p>

              <p className="text-sm sm:text-base text-gray-500 mt-1">
                {shortTagLine}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight mb-4">
              Skill Evaluation
            </h3>
            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span>{s.label}</span>
                    <span className="font-semibold text-pink-700 ">
                      {s.value}
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 sm:h-3 rounded-full">
                    <div
                      className="bg-pink-500 h-full rounded-full "
                      style={{ width: `${s.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight mb-4">
              Performance Trend
            </h3>
            <div className="h-64 sm:h-72">
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis domain={[0, 10]} />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#FF4E9F"
                      fill="#bbf7d0"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight mb-4">
              Question Breakdown
            </h3>
            <div className="space-y-6">
              {questionWiseScore.map((q, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow border border-gray-100"
                >
                  {/* Question */}
                  <p className="font-semibold text-gray-800">
                    Q{i + 1}. {q.question}
                  </p>

                  {/* Score */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Score</span>

                    <span className="text-pink-600 font-bold">
                      {q.score || 0}/10
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 h-2 rounded mt-2">
                    <div
                      className="bg-pink-500 h-2 rounded"
                      style={{ width: `${(q.score || 0) * 10}%` }}
                    ></div>
                  </div>

                  {/* Feedback */}
                  <p className="text-sm text-gray-500 mt-3">
                    {q.feedback || "No feedback available"}
                  </p>

                  {/* Skill Scores */}
                  <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-400">Confidence</p>
                      <p className="font-semibold text-gray-700">
                        {q.confidence || 0}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-400">Communication</p>
                      <p className="font-semibold text-gray-700">
                        {q.communication || 0}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-400">Correctness</p>
                      <p className="font-semibold text-gray-700">
                        {q.correctness || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Step3Report;
