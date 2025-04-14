import { useState } from "react";
import API from "../services/api";

function GiftForm({ onGiftAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    giftedBy: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await API.post("/gifts", formData);
    setFormData({ name: "", description: "", type: "", giftedBy: "" });
    onGiftAdded();
  };

  return (
    <div>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Gift Name" />
      <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
      <input name="giftedBy" value={formData.giftedBy} onChange={handleChange} placeholder="Gifted By" />
      <button onClick={handleSubmit}>Add Gift</button>
    </div>
  );
}

export default GiftForm;
