import { useState, useEffect } from "react";

function GiftModal({ show, onClose, onSubmit, gift }) {
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
    } else {
      setForm({ name: "", description: "", type: "", giftedBy: "" });
    }
  }, [gift]);

  const handleSubmit = () => {
    onSubmit(form);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md sm:max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          {gift ? "Edit Gift" : "Add New Gift"}
        </h2>
        {["name", "description", "type", "giftedBy"].map((field) => (
          <input
            key={field}
            className="w-full p-3 mb-4 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
          <button
            className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
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
