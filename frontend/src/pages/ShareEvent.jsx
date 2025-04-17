import { useState } from "react";
import axios from "axios";
import API from "../services/api";

const ShareEvent = ({ eventId }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleShare = async () => {
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // Adjust if stored differently

      const res = await API.post(
        "/events/shareevent",
        {
          eventId,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Event shared successfully!");
      setEmail("");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Failed to share event"
      );
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-xl w-full max-w-md space-y-2">
      <h2 className="text-lg font-semibold">Share this event</h2>
      <input
        type="email"
        className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
        placeholder="User email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleShare}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-medium"
      >
        Share
      </button>
      {message && <p className="text-sm text-green-400">{message}</p>}
    </div>
  );
};

export default ShareEvent;
