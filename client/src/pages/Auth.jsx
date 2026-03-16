import React from "react";
import { VscRobot } from "react-icons/vsc";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase.js";
import { serverUrl } from "../App.jsx";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
const Auth = ({isModel=false}) => {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;
      const result = await axios.post(
        `${serverUrl}/api/auth/google`,
        {
          name,
          email,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      navigate("/")
    } catch (error) {
      console.log(error);
      dispatch(setUserData(null));
    }
  };

  return (
    <div className={
      `w-full ${isModel ? "py-4 " : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}`
    }>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className="w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-[#FF2E9F] text-white p-2 rounded-lg">
            <VscRobot size={24} />
          </div>
          <h2 className="font-semibold text-lg">PrepSphere</h2>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4">
          Welcome to PrepSphere
          <span className="bg-pink-100 text-[#FF2E9F] px-4 py-2 rounded-full inline-flex items-center justify-center gap-2">
            <IoSparkles size={16} />
            AI powered interview
          </span>
        </h1>
        <p className="text-center text-gray-500 text-sm md:text-base leading-relaxed mb-8">
          Prepare for your interviews with AI-powered practice sessions and
          personalized feedback.
        </p>
        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ opacity: 0.9, scale: 1.03 }}
          whileTap={{ opacity: 1, scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md"
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>
      </motion.div>
      
    </div>
  );
};

export default Auth;
