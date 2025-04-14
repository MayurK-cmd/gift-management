import API from "../services/api";

function GiftList({ gifts, onGiftUpdated }) {
  const deleteGift = async (id) => {
    await API.delete(`/gifts/${id}`);
    onGiftUpdated();
  };

  return (
    <ul>
      {gifts.map((gift) => (
        <li key={gift.id}>
          <strong>{gift.name}</strong> - {gift.description} ({gift.type}) - Gifted by {gift.giftedBy}
          <button onClick={() => deleteGift(gift.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default GiftList;
