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
    setLoading(true);
    try {
      const res = await API.get("/gifts");
      const data = Array.isArray(res.data) ? res.data : [];
      setGifts(data);
      setShowGifts(true);
    } catch (err) {
      console.error("Failed to fetch gifts:", err);
      toast.error("Failed to load gifts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Navbar */}
      <nav className="bg-black p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 shadow">
        <h1 className="text-2xl font-bold text-white text-center sm:text-left">🎁 Gift Tracker</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm"
            onClick={() => setShowModal(true)}
          >
            + Add Gift
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm"
            onClick={fetchGifts}
          >
            View All Gifts
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        {/* Stats Section */}
        <section className="mb-6 bg-gray-900 p-4 rounded-md shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Dashboard Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-base sm:text-lg text-white">Total Gifts</h3>
              <p className="text-xl font-bold">{gifts.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-base sm:text-lg text-white">Gifts Added This Month</h3>
              <p className="text-xl font-bold">
                {gifts.filter(gift => new Date(gift.createdAt).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-base sm:text-lg text-white">Gift Categories</h3>
              <p className="text-xl font-bold">4</p>
            </div>
          </div>
        </section>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-gray-500 border-t-transparent rounded-full"></div>
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
