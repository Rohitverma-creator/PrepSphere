import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../App";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    credits: 200,
    description: "Perfect for beginners starting interview preparation.",
    features: [
      "200 AI Interview Credits",
      "Basic Performance Report",
      "Voice Interview Access",
      "Limited History Tracking",
    ],
    popular: false,
  },
  {
    id: "starter",
    name: "Starter Pack",
    price: "₹99",
    credits: 500,
    description: "Great for focused practice and improving interview skills.",
    features: [
      "500 AI Interview Credits",
      "Detailed AI Feedback",
      "Voice + Text Interview",
      "Interview History",
      "Performance Analytics",
    ],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "₹299",
    credits: 4000,
    description: "Best for serious job preparation and unlimited practice.",
    features: [
      "4000 AI Interview Credits",
      "Advanced AI Feedback",
      "Unlimited Voice Interviews",
      "Full Interview History",
      "Skill Improvement Suggestions",
      "Priority Support",
    ],
    popular: false,
  },
];

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      // Create Order
      const { data } = await axios.post(
        `${serverUrl}/api/payment/order`,
        {
          amount: Number(plan.price.replace("₹", "")),
          credits: plan.credits,
        },
        { withCredentials: true }
      );

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "PrepSphere",
        description: plan.name,
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${serverUrl}/api/payment/verify`,
              response,
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              alert("Payment Successful 🎉");
              window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        },

        prefill: {
          name: "User",
          email: "user@email.com",
        },

        theme: {
          color: "#ec4899",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoadingPlan(null);
    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-pink-100 py-16 px-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-14 flex items-start gap-4">
        <button
          onClick={() => navigate("/")}
          className="mt-2 p-3 rounded-full bg-white shadow hover:shadow-lg transition"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>

        <div className="text-center w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Choose your plan
          </h1>

          <p className="text-gray-500 mt-3 text-sm sm:text-base">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, y: -6 }}
            className={`relative cursor-pointer rounded-2xl p-8 border shadow-lg transition
            ${
              selectedPlan === plan.id
                ? "border-pink-500 bg-pink-50 shadow-2xl scale-105"
                : "border-gray-200 bg-white"
            }`}
          >

            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs px-4 py-1 rounded-full shadow">
                Most Popular
              </span>
            )}

            <h2 className="text-xl font-bold text-gray-800 text-center">
              {plan.name}
            </h2>

            <p className="text-4xl font-bold text-pink-600 text-center mt-3">
              {plan.price}
            </p>

            <p className="text-gray-500 text-sm text-center mt-3">
              {plan.description}
            </p>

            <div className="w-full h-px bg-gray-200 my-6"></div>

            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="text-gray-600 text-sm flex items-center gap-2"
                >
                  <span className="text-green-500">✔</span>
                  {feature}
                </li>
              ))}
            </ul>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handlePayment(plan)}
              disabled={loadingPlan === plan.id}
              className="mt-8 w-full py-2.5 rounded-lg font-medium bg-pink-500 text-white"
            >
              {loadingPlan === plan.id ? "Processing..." : "Buy Now"}
            </motion.button>

          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
