import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import Auth from "../pages/Auth";
import AuthModel from "./AuthModel";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!userData) {
      setShowUserPopup(false);
      setShowCreditPopup(false);
    }
  }, [userData]);

  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative"
      >
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-[#FF2E9F] text-white p-2 rounded-lg">
            <BsRobot size={24} />
          </div>
          <h1 className="font-semibold hidden md:block text-lg text-[#1E1B4B]">
            PrepSphere
          </h1>
        </div>
        <div className="flex items-center gap-6 relative">
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#FF2E9F] text-white font-semibold rounded-full shadow-lg hover:opacity-90 transition duration-300"
            >
              <BsCoin size={18} />
              <span>{userData?.user?.credits || 0}</span>
            </button>
            {showCreditPopup && userData && (
              <div className="absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50 ">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Need more credits to continue your interviews?
                </p>

                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full py-3 bg-gradient-to-r from-[#1E1B4B] to-[#FF2E9F] text-white font-semibold rounded-xl shadow-md hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
                >
                  Buy Credits
                </button>
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#1E1B4B] to-[#FF2E9F] text-white font-semibold shadow-md hover:scale-105 transition duration-300"
            >
              {userData?.user?.name ? (
                userData.user.name.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={16} />
              )}
            </button>
            {showUserPopup && userData && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-50">
                <p className="text-lg font-semibold text-[#1E1B4B] mb-3">
                  {userData?.user?.name}
                </p>

                <button
                  onClick={() => navigate("/history")}
                  className="w-full mb-2 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-[#FF2E9F] hover:text-white transition-all duration-300"
                >
                  Interview History
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  <HiOutlineLogout size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Navbar;
