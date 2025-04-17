import { useState } from "react";
import API from "../services/api";

function ShareEventModal({ eventId, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleShareEvent = async () => {
    try {
      const res = await API.post("/events/shareevent", { eventId, email });
      if (res.status === 200) {
        onClose(); // Close the modal on successful share
      }
    } catch (err) {
      console.error("Error sharing event:", err);
      setError("Failed to share the event. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md sm:max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          Share Event
        </h2>

        {/* Email input */}
        <input
          type="email"
          placeholder="Enter email of the user"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {/* Error message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
          <button
            className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            onClick={onClose} // Close the modal without sharing
          >
            Cancel
          </button>
          <button
            className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            onClick={handleShareEvent} // Trigger sharing the event
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareEventModal;
