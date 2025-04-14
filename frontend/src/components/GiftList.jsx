import { useState } from "react";
import API from "../services/api"; // Ensure this import is correct
import { toast } from "react-toastify";
import ConfirmationModal from "../modals/ConfirmationModal"; // Import the new ConfirmationModal component
import UpdateGiftModal from "../modals/UpdateModal"; // Import the new UpdateGiftModal component

function GiftList({ gifts, onGiftUpdated }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [giftToDelete, setGiftToDelete] = useState(null); // Store the gift to be deleted
  const [giftToUpdate, setGiftToUpdate] = useState(null); // Store the gift to be updated

  const handleDelete = (giftId) => {
    setGiftToDelete(giftId); // Set the gift to be deleted
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/gifts/${giftToDelete}`);
      toast.success("Gift deleted successfully!");
      onGiftUpdated(); // Trigger re-fetch of the gifts
      setShowDeleteModal(false); // Close the modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete gift.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Close the modal without deleting
  };

  const handleUpdate = (gift) => {
    setGiftToUpdate(gift); // Set the gift to be updated
    setShowUpdateModal(true); // Open the update modal
  };

  const handleGiftUpdated = () => {
    onGiftUpdated(); // Re-fetch gifts after update
    setShowUpdateModal(false); // Close the modal after update
  };

  if (!Array.isArray(gifts) || gifts.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400 text-sm">
        No gifts found. Click "View All Gifts" to load data.
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full border border-gray-700 text-sm text-left text-gray-300">
        <thead className="bg-gray-700 text-gray-200 uppercase">
          <tr>
            <th className="border border-gray-600 px-4 py-3">Name</th>
            <th className="border border-gray-600 px-4 py-3">Description</th>
            <th className="border border-gray-600 px-4 py-3">Type</th>
            <th className="border border-gray-600 px-4 py-3">Gifted By</th>
            <th className="border border-gray-600 px-4 py-3">Created At</th>
            <th className="border border-gray-600 px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {gifts.map((gift) => (
            <tr key={gift.id} className="hover:bg-gray-800 transition">
              <td className="border border-gray-700 px-4 py-2">{gift.name || "-"}</td>
              <td className="border border-gray-700 px-4 py-2">{gift.description || "-"}</td>
              <td className="border border-gray-700 px-4 py-2">{gift.type || "-"}</td>
              <td className="border border-gray-700 px-4 py-2">{gift.giftedBy || "-"}</td>
              <td className="border border-gray-700 px-4 py-2">
                {gift.createdAt
                  ? new Date(gift.createdAt).toLocaleDateString()
                  : "-"}
              </td>
              <td className="border border-gray-700 px-4 py-2 text-right">
                <button
                  className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                  onClick={() => handleUpdate(gift)}
                >
                  Update
                </button>
                <button
                  className="text-red-400 hover:text-red-300 underline ml-4 cursor-pointer"
                  onClick={() => handleDelete(gift.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show the confirmation modal for deletion */}
      {showDeleteModal && (
        <ConfirmationModal
          onConfirm={confirmDelete} // When user clicks Yes
          onCancel={cancelDelete} // When user clicks No
        />
      )}

      {/* Show the update modal for editing */}
      {showUpdateModal && (
        <UpdateGiftModal
          gift={giftToUpdate}
          onClose={() => setShowUpdateModal(false)} // Close the modal without updating
          onUpdate={handleGiftUpdated} // Trigger the update after successful modification
        />
      )}
    </div>
  );
}

export default GiftList;
