import { useState, useEffect } from "react";

function UpdateGiftModal({ show, onClose, gift, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    giftedBy: "",
  });

  useEffect(() => {
    if (gift) {
      setFormData({
        name: gift.name || "",
        description: gift.description || "",
        type: gift.type || "",
        giftedBy: gift.giftedBy || "",
      });
    }
  }, [gift]);

  if (!show || !gift) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Update Gift</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Gift Name"
            className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900"
          />
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Type"
            className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900"
          />
          <input
            name="giftedBy"
            value={formData.giftedBy}
            onChange={handleChange}
            placeholder="Gifted By"
            className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateGiftModal;
