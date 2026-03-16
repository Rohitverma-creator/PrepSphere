import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recoginationRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];
 const navigate=useNavigate()
  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const speakTest = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakTest(
          `Hi ${userName}, it's great to see you here. Get ready to answer some exciting interview questions.`,
        );

        await speakTest(
          "I'll ask you few questions.Just answer naturally ,and take your time.Let's begin",
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakTest("Alright ,this one might be a bit more challenging.");
        }
      }

      await speakTest(currentQuestion.question);

      if (isMicOn) {
        startMic();
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase || !currentQuestion || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isIntroPhase, isSubmitting]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) continue;

        const transcript = event.results[i][0].transcript.trim();

        if (!isAIPlaying) {
          setAnswer((prev) => prev + " " + transcript);
        }
      }
    };

    recognition.onend = () => {
      if (!isMicOn) return;

      setTimeout(() => {
        try {
          recognition.start();
        } catch (e) {}
      }, 500);
    };

    recoginationRef.current = recognition;
  }, []);

  const startMic = () => {
    if (!recoginationRef.current) return;
    try {
      recoginationRef.current.start();
    } catch (error) {}
  };

  const stopMic = () => {
    if (recoginationRef.current) {
      recoginationRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;

    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        serverUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      setFeedback(result.data.feedback);
      speakTest(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakTest("Alright,let's move to the next question.");

    setCurrentIndex(currentIndex + 1);

    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);

    try {
      const result = await axios.post(
        serverUrl + "/api/interview/finish",
        {
          interviewId,
        },
        { withCredentials: true },
      );
       
         navigate("/interview-finished")

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recoginationRef.current) {
        recoginationRef.current.stop();
        recoginationRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);
  return (
    <div
      className="min-h-screen bg-linear-to-br from-pink-100 via-white to-teal-100 flex 
    items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">
        {/*video section*/}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200 ">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              autoPlay
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>
          {/* subtitle area */}

          {subtitle && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}{" "}
              </p>
            </div>
          )}

          {/* title */}
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Interview Status</span>
              {isAIPlaying && (
                <span className="text-sm font-semibold text-[#FF2E9F]">
                  {isAIPlaying ? "AI Speaking" : ""}
                </span>
              )}
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-center ">
              <Timer
                className=""
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <span className="text-2xl font-bold text-[#FF2E9F]">
                {currentIndex + 1}
              </span>
              <span className="text-xs text-gray-400">Current Question</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#FF2E9F]">
                {questions.length}
              </span>
              <span className="text-xs text-gray-400"> Total Questions</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-[#FF2E9F] mb-6">
            AI Smart Interview
          </h2>
          {!isIntroPhase && (
            <div className="relative mb-6 bg-gray-50 p-4 ssm:p-6 rounded-2xl border border-gray-200 shadow-sm ">
              <p className="text-xs sm:text-sm text-gray-400 mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                  {currentQuestion?.question}
                </div>
              </div>
            </div>
          )}
          <textarea
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            placeholder="Type your answer here.."
            className="w-full min-h-[180px] bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none
  border border-gray-200 focus:ring-2 focus:ring-pink-500 transition text-gray-800"
          />
          {!feedback ? (
            <div className="flex items-center gap-4 mt-6">
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 sm:w-14 flex items-center justify-center rounded-full
          bg-black text-white shadow-lg "
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                onClick={() => submitAnswer()}
                disabled={isSubmitting}
                whileTap={{ scale: 0.9 }}
                className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold text-white
  bg-gradient-to-r from-[#1E1B4B] to-[#FF2E9F]
  shadow-md hover:shadow-[0_0_15px_#FF2E9F]
  hover:scale-[1.02] transition-all duration-300 disabled:bg-gray-500"
              >
                {isSubmitting ? "Submitting.." : " Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-[#FF69BF] border border-[#FF69BF] p-5 rounded-2xl
             shadow-sm"
            >
              <p className="text-[#FF69BF] font-medium mb-4">{feedback}</p>
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg font-semibold text-white
            bg-gradient-to-r from-[#1E1B4B] to-[#FF2E9F]
               shadow-md hover:shadow-[0_0_15px_#FF2E9F]
                 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center gap-1"
              >
                Next Question <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Interview;
