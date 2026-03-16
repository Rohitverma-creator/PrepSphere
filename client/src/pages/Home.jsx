import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { HiSparkles } from "react-icons/hi";
import AuthModel from "../components/AuthModel";
import { useNavigate } from "react-router-dom";
import {
  BsBarChart,
  BsChat,
  BsClock,
  BsFileEarmark,
  BsFileEarmarkText,
  BsMic,
  BsRobot,
  BsGraphUp,
} from "react-icons/bs";

import evalImg from "../assets/ai-ans.webp";
import hrImg from "../assets/HR.jpg";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.jpg";
import Footer from "../components/Footer";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-12">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full flex items-center gap-2">
            <HiSparkles size={14} className="bg-pink-50 text-[#FF2E9F]" />
            AI powered interview preparation
          </div>
        </div>

        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-4xl font-semibold leading-tight max-w-3xl mx-auto"
          >
            Practice Interview with
            <span className="relative inline-block ml-2">
              <span className="bg-pink-200 text-[#FF2E9F] px-3 py-1 rounded-full">
                AI Intelligence
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-gray-500 mt-4 max-w-xl mx-auto text-base"
          >
            Practice interviews with our AI platform that simulates real
            interview scenarios and provides instant feedback to improve your
            performance.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="py-2 px-4 rounded-lg font-semibold text-sm text-white 
                bg-gradient-to-r from-[#1E1B4B] to-[#FF2E9F] shadow-md"
              >
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm
                bg-gray-100 text-[#1E1B4B] hover:bg-[#FF2E9F] hover:text-white transition"
              >
                📜 View History
              </motion.button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
          {[
            {
              icon: <BsRobot size={24} />,
              step: "STEP 1",
              title: "Role & Experience Selection",
              desc: "Select from a variety of interview types and difficulty levels to practice.",
            },
            {
              icon: <BsMic size={24} />,
              step: "STEP 2",
              title: "Smart Voice Interview",
              desc: "Engage in realistic interview simulations and receive instant feedback.",
            },
            {
              icon: <BsClock size={24} />,
              step: "STEP 3",
              title: "Timer Based Simulation",
              desc: "Real Interview pressure with time tracking and performance.",
            },
          ].map((item, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.06 }}
                className={`relative bg-white rounded-3xl border-2 border-pink-200 hover:border-pink-600
        p-10 w-80 max-w-[90%] shadow-md hover:shadow-lg transition-all duration-300
        ${index === 0 ? "rotate-[-4deg]" : ""}
        ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-2xl" : ""}
        ${index === 2 ? "rotate-[-3deg]" : ""}`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-500 text-[#FF2E9F] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  {item.icon}
                </div>

                <p className="text-sm text-pink-500 mt-8">{item.step}</p>
                <h3 className="font-semibold text-lg mt-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="mb-22">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold text-center mb-16"
          >
            Advance AI <span className="text-[#FF2E9F]">Capabilities</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                image: evalImg,
                icon: <BsBarChart size={16} />,
                title: "AI Answer Evaluation",
                desc: "Scores communication, technical accuracy and confidence.",
              },
              {
                image: resumeImg,
                icon: <BsFileEarmarkText size={16} />,
                title: "Resume Based Interview",
                desc: "Project-specific questions based on uploaded resume.",
              },
              {
                image: pdfImg,
                icon: <BsFileEarmarkText size={16} />,
                title: "Downloadable PDF Report",
                desc: "Detailed strengths, weaknesses and improvement insights.",
              },
              {
                image: analyticsImg,
                icon: <BsBarChart size={16} />,
                title: "History & Analytics",
                desc: "Track progress with performance graphs and topic analysis.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="relative bg-gray-50 border border-gray-200 hover:border-[#FF2E9F]
      rounded-2xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition"
              >
                {/* icon badge */}
                <div
                  className="absolute top-4 right-4 bg-green-100 text-green-600 
      w-8 h-8 rounded-lg flex items-center justify-center"
                >
                  {item.icon}
                </div>

                {/* image */}
                <img src={item.image} className="w-28 h-28 object-contain" />

                {/* text */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-22">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold text-center mb-16"
          >
            Multiple Interviews <span className="text-[#FF2E9F]">Modes</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                image: hrImg,
            
                title: "AI Answer Evaluation",
                desc: "Scores communication, technical accuracy and confidence.",
              },
              {
                image: techImg,
                title: "Resume Based Interview",
                desc: "Project-specific questions based on uploaded resume.",
              },
              {
                image: confidenceImg,
                title: "Downloadable PDF Report",
                desc: "Detailed strengths, weaknesses and improvement insights.",
              },
              {
                image: creditImg,
                title: "History & Analytics",
                desc: "Track progress with performance graphs and topic analysis.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="relative bg-gray-50 border border-gray-200 hover:border-[#FF2E9F]
      rounded-2xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition"
              >
              

                {/* image */}
                <img src={item.image} className="w-28 h-28 object-contain" />

                {/* text */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Home;
