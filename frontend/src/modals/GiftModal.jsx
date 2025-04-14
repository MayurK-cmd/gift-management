import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function GiftModal({ gift, onClose, onGiftUpdated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    giftedBy: "",
  });

  useEffect(() => {
    if (gift) {
      setForm({
        name: gift.name || "",
        description: gift.description || "",
        type: gift.type || "",
        giftedBy: gift.giftedBy || "",
      });
    }
  }, [gift]);

  const handleSubmit = async () => {
    try {
      if (gift) {
        await API.put(`/gifts/${gift.id}`, form);
        toast.success("Gift updated successfully!");
      } else {
        await API.post("/gifts", form);
        toast.success("Gift added successfully!");
      }
      onGiftUpdated(); // Trigger re-fetch of gifts
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to save gift.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          {gift ? "Edit Gift" : "Add New Gift"}
        </h2>
        {["name", "description", "type", "giftedBy"].map((field) => (
          <input
            key={field}
            className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default GiftModal;
