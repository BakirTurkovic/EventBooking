import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEvents = () => api.get('/events');
export const getEventById = (id) => api.get(`/events/${id}`);
export const getLocations = () => api.get('/locations');
export const createReservation = (data) => api.post('/reservations', data);
export const getUserReservations = (email) => api.get(`/reservations/user?email=${email}`);
export const cancelReservation = (id) => api.delete(`/reservations/${id}`);

export default api;