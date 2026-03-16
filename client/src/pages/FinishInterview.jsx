import React from "react";
import { useNavigate } from "react-router-dom";

const FinishInterview = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-teal-100">
      <div className="bg-white shadow-xl rounded-3xl p-10 text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Interview Finished Successfully 🎉
        </h1>

        <p className="text-gray-500 mb-6">
          Your interview has been submitted successfully.
        </p>

        <button
          onClick={() => navigate("/history")}
          className="px-6 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#FF2E9F] text-white rounded-xl font-semibold hover:scale-105 transition"
        >
          View History
        </button>
      </div>
    </div>
  );
};

export default FinishInterview;
