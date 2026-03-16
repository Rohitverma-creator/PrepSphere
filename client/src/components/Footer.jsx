import React from "react";
import { BsRobot } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-[#f3f3f3] flex justify-center px-4 py-12">
      <div className="w-full max-w-6xl bg-white rounded-[24px] border border-gray-200 shadow-sm px-8 py-10 text-center">

   
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg">PrepSphere</h2>
        </div>

       
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          AI powered interview practice with real questions, instant feedback,
          and performance insights to help you improve your communication,
          technical skills, and confidence before the real interview.
        </p>

     
        <div className="border-t border-gray-200 my-6"></div>

       
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} PrepSphere. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;