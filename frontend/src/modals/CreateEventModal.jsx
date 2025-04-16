import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const CreateEventModal = ({ show, onClose }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Event name is required!");
      return;
    }

    try {
      await API.post(
        "/events/newevent",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Event created successfully!");
      onClose();
      navigate(`/dashboard/${name}`);
    } catch (err) {
      console.error("Failed to create event:", err);
      toast.error("Failed to create event.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md sm:max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Create Event
        </h2>
        <input
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
          <button
            className="bg-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
