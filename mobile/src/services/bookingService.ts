import api from './api';
import { Booking } from '../types';

interface CreateBookingData {
  caretakerId: string;
  date: string;
  startTime: string;
  duration: number;
  serviceNotes: string;
  address: string;
}

export const bookingService = {
  create: async (data: CreateBookingData) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getAll: async (params?: { status?: string; limit?: number; offset?: number }) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Booking }> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string, reason?: string) => {
    const response = await api.patch(`/bookings/${id}/status`, { status, reason });
    return response.data;
  },

  getAvailability: async (caretakerId: string, fromDate: string, toDate: string) => {
    const response = await api.get(`/bookings/availability/${caretakerId}`, {
      params: { fromDate, toDate },
    });
    return response.data;
  },
};
