import { useState, useEffect } from "react";
import API from "../services/api";
import GiftList from "../components/GiftList";
import GiftModal from "../modals/GiftModal";
import { toast } from "react-toastify";

function Dashboard() {
  const [gifts, setGifts] = useState([]);
  const [showGifts, setShowGifts] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchGifts = async () => {
    setLoading(true); // Start loading
    try {
      const res = await API.get("/gifts");
      const data = Array.isArray(res.data) ? res.data : [];
      setGifts(data);
      setShowGifts(true);
    } catch (err) {
      console.error("Failed to fetch gifts:", err);
      toast.error("Failed to load gifts.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchGifts(); // Fetch gifts when the dashboard is loaded
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Navbar */}
      <nav className="bg-black p-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold text-white">🎁 Gift Tracker</h1>
        <div className="space-x-4">
          <button
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded cursor-pointer"
            onClick={() => setShowModal(true)} // Opens the GiftModal
          >
            + Add Gift
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded cursor-pointer"
            onClick={fetchGifts} // Refresh gifts list
          >
            View All Gifts
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Section */}
        <section className="mb-6 bg-gray-900 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Dashboard Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg text-white">Total Gifts</h3>
              <p className="text-xl font-bold">{gifts.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg text-white">Gifts Added This Month</h3>
              <p className="text-xl font-bold">
                {gifts.filter(gift => new Date(gift.createdAt).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg text-white">Gift Categories</h3>
              <p className="text-xl font-bold">4</p>
            </div>
          </div>
        </section>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin text-gray-500"></div>
          </div>
        ) : (
          showGifts && (
            <GiftList gifts={gifts} onGiftUpdated={fetchGifts} />
          )
        )}
      </main>

      {/* Modal for Adding Gifts */}
      {showModal && (
        <GiftModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default Dashboard;
