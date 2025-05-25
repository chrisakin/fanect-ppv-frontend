import { create } from 'zustand';
import axios from '@/lib/axios';

export interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  bannerUrl: string;
  watermarkUrl: string;
  price: string;
  eventDateTime: string;
}

interface PaginationData {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  limit: number;
}

interface EventState {
  events: Event[];
  isLoading: boolean;
  isDeleteLoading: boolean;
  isUpdateLoading: boolean;
  pagination: PaginationData;
  selectedEvent: Event | null;
  fetchUpcomingEvents: (page?: number) => Promise<void>;
  fetchMyEvents: (page?: number) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateEvent: (id: string, data: FormData) => Promise<void>;
  setSelectedEvent: (event: Event | null) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: false,
  isDeleteLoading: false,
  isUpdateLoading: false,
  selectedEvent: null,
  pagination: {
    totalDocs: 0,
    totalPages: 1,
    currentPage: 1,
    nextPage: null,
    previousPage: null,
    limit: 10
  },
  fetchUpcomingEvents: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/events/upcoming?page=${page}&limit=10`);
      const { docs, ...paginationData } = response.data;
      
      set({
        events: docs,
        pagination: paginationData,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      set({ events: [], isLoading: false });
    }
  },
  fetchMyEvents: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/events?page=${page}&limit=10`);
      const { docs, ...paginationData } = response.data;
      
      set({
        events: docs,
        pagination: paginationData,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      set({ events: [], isLoading: false });
    }
  },
  deleteEvent: async (id: string) => {
    try {
      set({ isDeleteLoading: true });
      await axios.delete(`/events/${id}`);
      set((state) => ({
        events: state.events.filter(event => event._id !== id),
        isDeleteLoading: false
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
      set({ isDeleteLoading: false });
      throw error;
    }
  },
  updateEvent: async (id: string, data: FormData) => {
    try {
      set({ isUpdateLoading: true });
      const response = await axios.put(`/events/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({
        events: state.events.map(event => 
          event._id === id ? response.data : event
        ),
        isUpdateLoading: false,
        selectedEvent: null
      }));
    } catch (error) {
      console.error('Error updating event:', error);
      set({ isUpdateLoading: false });
      throw error;
    }
  },
  setSelectedEvent: (event) => set({ selectedEvent: event })
}));