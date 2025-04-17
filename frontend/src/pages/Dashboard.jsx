import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Ensure to import your API helper
import CreateEventModal from "../modals/CreateEventModal";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [sharedEvents, setSharedEvents] = useState([]);  // State for shared events
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch events when the component mounts
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchEvents();  // Fetch user's events
      fetchSharedEvents();  // Fetch events shared with the user
    }
  }, [token]);

  const fetchEvents = async () => {
    try {
      const response = await API.get("/events/getevent");  // Assuming /getevent returns the events created by the user
      setEvents(response.data);  // Set events state
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchSharedEvents = async () => {
    try {
      const response = await API.get("/events/getSharedEvents");  // Assuming this returns shared events
      setSharedEvents(response.data);  // Set shared events state
    } catch (error) {
      console.error("Error fetching shared events:", error);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/dashboard/${eventId}`);
    // Navigate to /dashboard/:eventId
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="bg-white p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center sm:text-left">🎁 Gift Tracker</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm"
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
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>

        {/* Event Table */}
        <div className="overflow-x-auto mt-4">
          <h3 className="text-xl text-gray-800">My Events</h3>
          <table className="table-auto w-full text-left text-gray-700">
            <thead className="bg-gray-200">
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
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleEventClick(eventItem.id)}
                  >
                    <td className="px-4 py-2">{eventItem.name}</td>
                    <td className="px-4 py-2">{eventItem.gifts.length}</td>
                    <td className="px-4 py-2">{eventItem.id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center px-4 py-2 text-gray-600">No events found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Shared Events Table */}
        <div className="overflow-x-auto mt-8">
          <h3 className="text-xl text-gray-800">Events Shared with Me</h3>
          <table className="table-auto w-full text-left text-gray-700">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Event Name</th>
                <th className="px-4 py-2">Gifts Count</th>
                <th className="px-4 py-2">Event ID</th>
              </tr>
            </thead>
            <tbody>
              {sharedEvents.length > 0 ? (
                sharedEvents.map((eventItem) => (
                  <tr
                    key={eventItem.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleEventClick(eventItem.id)}
                  >
                    <td className="px-4 py-2">{eventItem.name}</td>
                    <td className="px-4 py-2">{eventItem.gifts.length}</td>
                    <td className="px-4 py-2">{eventItem.id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center px-4 py-2 text-gray-600">No shared events found</td>
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
