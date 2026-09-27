import { useState, useEffect } from 'react';
import { getEvents, createReservation } from '../api';
import { Calendar, MapPin, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ customerName: '', customerEmail: '', numberOfTickets: 1 });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await createReservation({
        eventId: selectedEvent.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        numberOfTickets: parseInt(formData.numberOfTickets),
      });
      setMessage({ type: 'success', text: 'Reservation successful!' });
      setSelectedEvent(null);
      setFormData({ customerName: '', customerEmail: '', numberOfTickets: 1 });
      fetchEvents();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to complete reservation.' });
    }
  };

  if (loading) return <div className="text-center py-10">Loading events...</div>;

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{event.description}</p>
            
            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(event.dateTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{event.location?.name}, {event.location?.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket size={16} />
                <span>Available: <strong>{event.availableTickets}</strong> tickets</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-lg font-bold text-indigo-600">${event.ticketPrice}</span>
              <button
                onClick={() => setSelectedEvent(event)}
                disabled={event.availableTickets === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:bg-gray-300 transition"
              >
                {event.availableTickets > 0 ? 'Book Ticket' : 'Sold Out'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-1">Book Tickets for {selectedEvent.title}</h3>
            <p className="text-sm text-gray-500 mb-4">Price per ticket: ${selectedEvent.ticketPrice}</p>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg p-2 text-sm"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full border rounded-lg p-2 text-sm"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Number of Tickets</label>
                <input
                  type="number"
                  min="1"
                  max={selectedEvent.availableTickets}
                  required
                  className="w-full border rounded-lg p-2 text-sm"
                  value={formData.numberOfTickets}
                  onChange={(e) => setFormData({ ...formData, numberOfTickets: e.target.value })}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}