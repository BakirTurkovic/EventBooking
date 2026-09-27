import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [ticketsCount, setTicketsCount] = useState(1);
  const [bookingMsg, setBookingMsg] = useState('');

  // Search states
  const [searchEmail, setSearchEmail] = useState('');
  const [myReservations, setMyReservations] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    axios.get(`${API_BASE}/events`)
      .then(res => {
        setEvents(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Ne mogu se učitati događaji. Provjeri da li backend radi na portu 8080.');
      })
      .finally(() => setLoading(false));
  };

  const handleBook = (e) => {
    e.preventDefault();
    setBookingMsg('');
    axios.post(`${API_BASE}/reservations`, {
      eventId: selectedEvent.id,
      customerName,
      customerEmail,
      numberOfTickets: parseInt(ticketsCount)
    })
    .then(() => {
      setBookingMsg('Rezervacija uspješno napravljena!');
      setSelectedEvent(null);
      setCustomerName('');
      setCustomerEmail('');
      setTicketsCount(1);
      fetchEvents();
    })
    .catch(err => {
      setBookingMsg('Greška: ' + (err.response?.data?.message || 'Rezervacija nije uspjela.'));
    });
  };

  const handleSearchReservations = (e) => {
    e.preventDefault();
    if (!searchEmail) return;
    axios.get(`${API_BASE}/reservations/user?email=${searchEmail}`)
      .then(res => {
        setMyReservations(res.data);
        setSearched(true);
      })
      .catch(err => console.error(err));
  };

  const handleCancelReservation = (id) => {
    axios.delete(`${API_BASE}/reservations/${id}`)
      .then(() => {
        setMyReservations(myReservations.filter(r => r.id !== id));
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#4f46e5', fontSize: '28px' }}>🎟️ EventBooking</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('events')} 
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #4f46e5', background: activeTab === 'events' ? '#4f46e5' : '#fff', color: activeTab === 'events' ? '#fff' : '#4f46e5', cursor: 'pointer', fontWeight: 'bold' }}>
            Događaji
          </button>
          <button 
            onClick={() => setActiveTab('reservations')} 
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #4f46e5', background: activeTab === 'reservations' ? '#4f46e5' : '#fff', color: activeTab === 'reservations' ? '#fff' : '#4f46e5', cursor: 'pointer', fontWeight: 'bold' }}>
            Moje Rezervacije
          </button>
        </div>
      </header>

      {/* Main Content */}
      {bookingMsg && (
        <div style={{ padding: '12px', borderRadius: '6px', background: '#dcfce7', color: '#166534', marginBottom: '20px', fontWeight: 'bold' }}>
          {bookingMsg}
        </div>
      )}

      {activeTab === 'events' ? (
        <div>
          {loading && <p>Učitavanje događaja...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {events.map(ev => (
              <div key={ev.id} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{ev.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>{ev.description}</p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>📍 {ev.location?.name}, {ev.location?.city}</p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>🎟️ Dostupno: <strong>{ev.availableTickets}</strong> karata</p>
                <p style={{ margin: '10px 0', fontSize: '18px', fontWeight: 'bold', color: '#4f46e5' }}>${ev.ticketPrice}</p>
                <button
                  onClick={() => setSelectedEvent(ev)}
                  disabled={ev.availableTickets === 0}
                  style={{ width: '100%', padding: '10px', background: ev.availableTickets > 0 ? '#4f46e5' : '#ccc', color: '#fff', border: 'none', borderRadius: '6px', cursor: ev.availableTickets > 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
                >
                  {ev.availableTickets > 0 ? 'Rezerviši Karta' : 'Rasprodato'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form onSubmit={handleSearchReservations} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Unesi svoj email..."
              required
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
              style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
            />
            <button type="submit" style={{ padding: '10px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Traži
            </button>
          </form>

          {searched && (
            <div>
              {myReservations.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center' }}>Nema pronađenih rezervacija za ovaj email.</p>
              ) : (
                myReservations.map(res => (
                  <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb', padding: '12px 16px', borderRadius: '8px', marginBottom: '10px' }}>
                    <div>
                      <strong style={{ display: 'block' }}>{res.event?.title}</strong>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Karte: {res.numberOfTickets} | Ukupno: ${res.totalPrice}</span>
                    </div>
                    <button onClick={() => handleCancelReservation(res.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                      Otkazi
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal za rezervaciju */}
      {selectedEvent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0 }}>Rezervacija: {selectedEvent.title}</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Cijena po karti: ${selectedEvent.ticketPrice}</p>
            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Ime i prezime"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
              />
              <input
                type="email"
                placeholder="Email adresa"
                required
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
              />
              <input
                type="number"
                min="1"
                max={selectedEvent.availableTickets}
                required
                value={ticketsCount}
                onChange={e => setTicketsCount(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setSelectedEvent(null)} style={{ padding: '8px 14px', border: '1px solid #ccc', background: '#fff', borderRadius: '6px', cursor: 'pointer' }}>
                  Odustani
                </button>
                <button type="submit" style={{ padding: '8px 14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Potvrdi Rezervaciju
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}