import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import GiftModal from "../modals/GiftModal";
import UpdateGiftModal from "../modals/UpdateGiftModal";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";
import ShareEventModal from "../modals/ShareEventModal"; // Import ShareEventModal

function GiftManager() {
  const { eventId } = useParams();
  const numericEventId = Number(eventId);
  const navigate = useNavigate();

  const [gifts, setGifts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [deletingGiftId, setDeletingGiftId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false); // State for controlling ShareEvent modal

  const fetchGifts = async () => {
    try {
      const res = await API.get("/gifts", { params: { eventId: numericEventId } });
      setGifts(res.data);
    } catch (err) {
      console.error("Error fetching gifts:", err);
    }
  };

  useEffect(() => {
    if (!eventId || isNaN(numericEventId) || numericEventId <= 0) {
      navigate("/dashboard");
    } else {
      fetchGifts();
    }
  }, [numericEventId, navigate, eventId]);

  const handleEditGift = (giftData) => {
    setEditingGift(giftData);
  };

  const handleDeleteGift = (id) => {
    setDeletingGiftId(id);
  };

  const confirmDeleteGift = async () => {
    try {
      await API.delete(`/gifts/${deletingGiftId}`);
      setDeletingGiftId(null);
      fetchGifts();
    } catch (err) {
      console.error("Failed to delete gift:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="bg-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold text-gray-900">🎁 Gifts for Event #{eventId}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm"
          >
            ➕ Add Gift
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
          >
            🔙 Go Back
          </button>
          {/* Share Event Button */}
          <button
            onClick={() => setShowShareModal(true)} // Trigger the ShareEvent modal
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm"
          >
            Share Event
          </button>
        </div>
      </nav>

      {/* Share Event Modal */}
      {showShareModal && (
        <ShareEventModal
          eventId={numericEventId}
          onClose={() => setShowShareModal(false)} // Close the modal
        />
      )}

      {/* Add Gift Modal */}
      {showForm && (
        <GiftModal
          show={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={async (formData) => {
            try {
              await API.post("/gifts", { ...formData, eventId: numericEventId });
              setShowForm(false);
              fetchGifts();
            } catch (err) {
              console.error("Error adding gift:", err);
            }
          }}
        />
      )}

      {/* Update Gift Modal */}
      {editingGift && (
        <UpdateGiftModal
          gift={editingGift}
          onClose={() => setEditingGift(null)}
          onSubmit={async (formData) => {
            try {
              await API.put(`/gifts/${editingGift.id}`, formData);
              setEditingGift(null);
              fetchGifts();
            } catch (err) {
              console.error("Error updating gift:", err);
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingGiftId && (
        <DeleteConfirmModal
          onCancel={() => setDeletingGiftId(null)}
          onConfirm={confirmDeleteGift}
        />
      )}

      {/* Gift List */}
      <main className="p-4 sm:p-6">
        <h2 className="text-2xl font-semibold text-gray-900">Gifts</h2>
        <div className="overflow-x-auto mt-4">
          <table className="table-auto w-full text-left text-gray-700">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Gift Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Gifted By</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gifts.length > 0 ? (
                gifts.map((gift) => (
                  <tr key={gift.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{gift.name}</td>
                    <td className="px-4 py-2">{gift.description}</td>
                    <td className="px-4 py-2">{gift.type}</td>
                    <td className="px-4 py-2">{gift.giftedBy}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEditGift(gift)}
                        className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGift(gift.id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center px-4 py-2 text-gray-600">No gifts added yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default GiftManager;
