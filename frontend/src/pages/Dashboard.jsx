import { useEffect, useState } from "react";
import API from "../services/api";
import GiftForm from "../components/GiftForm";
import GiftList from "../components/GiftList";

function Dashboard() {
  const [gifts, setGifts] = useState([]);

  const fetchGifts = async () => {
    const res = await API.get("/gifts");
    setGifts(res.data);
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  return (
    <div>
      <h2>Gift Dashboard</h2>
      <GiftForm onGiftAdded={fetchGifts} />
      <GiftList gifts={gifts} onGiftUpdated={fetchGifts} />
    </div>
  );
}

export default Dashboard;
