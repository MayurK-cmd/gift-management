import React, { useState, useEffect } from "react";
import API from "../services/api";

function UpdateGiftModal({ gift, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: gift.name,
    description: gift.description,
    type: gift.type,
    giftedBy: gift.giftedBy,
  });

  useEffect(() => {
    setForm({
      name: gift.name,
      description: gift.description,
      type: gift.type,
      giftedBy: gift.giftedBy,
    });
  }, [gift]);

  const handleUpdate = async () => {
    try {
      await API.put(`/gifts/${gift.id}`, form);
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update gift.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md sm:max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">Update Gift</h2>
        {["name", "description", "type", "giftedBy"].map((field) => (
          <input
            key={field}
            className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
          <button
            className="bg-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateGiftModal;
