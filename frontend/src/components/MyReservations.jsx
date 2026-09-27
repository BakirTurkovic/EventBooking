import { useState } from 'react';
import { getUserReservations, cancelReservation } from '../api';
import { Search, Trash2 } from 'lucide-react';

export default function MyReservations() {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const response = await getUserReservations(email);
      setReservations(response.data);
      setSearched(true);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelReservation(id);
      setReservations(reservations.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error cancelling reservation:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email address..."
          required
          className="flex-1 border rounded-lg p-2.5 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-indigo-700"
        >
          <Search size={16} />
          Find Bookings
        </button>
      </form>

      {searched && (
        <div className="space-y-3">
          {reservations.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No reservations found for this email.</p>
          ) : (
            reservations.map((res) => (
              <div key={res.id} className="border rounded-lg p-4 flex items-center justify-between bg-white">
                <div>
                  <h4 className="font-bold">{res.event?.title}</h4>
                  <p className="text-sm text-gray-500">Tickets: {res.numberOfTickets} | Total: ${res.totalPrice}</p>
                </div>
                <button
                  onClick={() => handleCancel(res.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Cancel Reservation"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}