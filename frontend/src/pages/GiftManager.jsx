import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import GiftModal from "../modals/GiftModal";
import UpdateGiftModal from "../modals/UpdateGiftModal";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";

function GiftManager() {
  const { eventId } = useParams();
  const numericEventId = Number(eventId);
  const navigate = useNavigate();

  const [gifts, setGifts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [deletingGiftId, setDeletingGiftId] = useState(null);

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
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎁 Gifts for Event #{eventId}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm"
          >
            ➕ Add Gift
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
          >
            🔙 Go Back
          </button>
        </div>
      </nav>

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
              console.error("Failed to add gift:", err);
            }
          }}
        />
      )}

      {/* Update Gift Modal */}
      {editingGift && (
        <UpdateGiftModal
          show={!!editingGift}
          onClose={() => setEditingGift(null)}
          gift={editingGift}
          onSubmit={async (formData) => {
            try {
              await API.put(`/gifts/${editingGift.id}`, formData);
              setEditingGift(null);
              fetchGifts();
            } catch (err) {
              console.error("Update failed:", err);
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingGiftId !== null && (
        <DeleteConfirmModal
          show={!!deletingGiftId}
          onCancel={() => setDeletingGiftId(null)}
          onConfirm={confirmDeleteGift}
        />
      )}

      {/* Gifts Table */}
      <main className="p-4">
        <h2 className="text-xl font-semibold mb-4">Gift List</h2>
        {gifts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border border-gray-700 text-gray-300">
              <thead className="bg-gray-800 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2 border-r border-gray-700">Name</th>
                  <th className="px-4 py-2 border-r border-gray-700">Description</th>
                  <th className="px-4 py-2 border-r border-gray-700">Type</th>
                  <th className="px-4 py-2 border-r border-gray-700">Gifted By</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gifts.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-700 border-t border-gray-700">
                    <td className="px-4 py-2 border-r border-gray-700">{g.name}</td>
                    <td className="px-4 py-2 border-r border-gray-700">{g.description}</td>
                    <td className="px-4 py-2 border-r border-gray-700">{g.type}</td>
                    <td className="px-4 py-2 border-r border-gray-700">{g.giftedBy}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEditGift(g)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteGift(g.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No gifts found for this event.</p>
        )}
      </main>
    </div>
  );
}

export default GiftManager;
