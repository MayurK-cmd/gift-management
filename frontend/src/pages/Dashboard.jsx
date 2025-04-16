import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";  // Make sure to import your API helper.
import CreateEventModal from "../modals/CreateEventModal";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch events when the component mounts
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchEvents();  // Fetch events after token check
    }
  }, [token]);

  const fetchEvents = async () => {
    try {
      const response = await API.get("/events/getevent");  // Assuming /getevent returns the events
      setEvents(response.data);  // Set events state
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/dashboard/${eventId}`);
  // Navigate to /dashboard/:eventId
  };

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
            Create Event
          </button>
        </div>
      </nav>

      {/* Create Event Modal */}
      <CreateEventModal show={showModal} onClose={() => setShowModal(false)} />

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>

        {/* Event Table */}
        <div className="overflow-x-auto mt-4">
          <table className="table-auto w-full text-left text-gray-300">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2">Event Name</th>
                <th className="px-4 py-2">Gifts Count</th>
                <th className="px-4 py-2">Event ID</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((eventItem) => (
                  <tr
                    key={eventItem.id}
                    className="hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleEventClick(eventItem.id)}  // Pass eventItem.id for navigation
                  >
                    <td className="px-4 py-2">{eventItem.name}</td>
                    <td className="px-4 py-2">{eventItem.gifts.length}</td>
                    <td className="px-4 py-2">{eventItem.id}</td>  {/* Display event ID */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center px-4 py-2">No events found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
