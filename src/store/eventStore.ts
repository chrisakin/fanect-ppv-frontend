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
  price: {currency: string, amount: string};
  eventDateTime: string;
  adminStatus: string;
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
  singleEvent: Event | null;
  fetchUpcomingEvents: (page?: number) => Promise<void>;
  fetchLiveEvents: (page?: number) => Promise<void>;
  fetchMyEvents: (page?: number) => Promise<void>;
  fetchStreampassEvents: (eventType: string, page?: number) => Promise<void>;
  fetchSingleEvent: (id: string) => Promise<void>;
  fetchPurchasedEvent: (id: string) => Promise<void>;
  searchEvents: (query: string, page?: number) => Promise<void>;
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
  singleEvent: null,
  pagination: {
    totalDocs: 0,
    totalPages: 1,
    currentPage: 1,
    nextPage: null,
    previousPage: null,
    limit: 12
  },
  fetchUpcomingEvents: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/events/upcoming?page=${page}&limit=12`);
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
  fetchLiveEvents: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/events/live?page=${page}&limit=12`);
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
      const response = await axios.get(`/events?page=${page}&limit=12`);
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
  fetchStreampassEvents: async (eventType: string, page = 1) => {
        try {
          set({ isLoading: true });
          const endpoint = eventType === 'upcoming' ? 
            `/streampass/upcoming?page=${page}&limit=12` : 
            eventType === 'live' ? 
            `/streampass/live?page=${page}&limit=12` :
            `/streampass/past?page=${page}&limit=12`;
          
          const response = await axios.get(endpoint);
          const { docs, ...paginationData } = response.data;
          set({
          events: docs,
          pagination: paginationData,
          isLoading: false
        });
        } catch (error) {
          console.error('Error fetching events:', error);
          set({ events: [], isLoading: false });
        } finally {
          set({ isLoading: false });
        }
  },
  fetchSingleEvent: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/events/${id}`);
      set({ singleEvent: response.data.event, isLoading: false });
    } catch (error) {
      console.error('Error fetching single event:', error);
      set({ singleEvent: null, isLoading: false });
    }
  },
  fetchPurchasedEvent: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/streampass/get-one-event/${id}`);
      set({ singleEvent: response.data.streampass.event, isLoading: false });
    } catch (error) {
      console.error('Error fetching purchased event:', error);
      set({ singleEvent: null, isLoading: false });
      throw error;
    }
  },
  searchEvents: async (query: string, page = 1) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/events/upcoming?page=${page}&limit=12&search=${encodeURIComponent(query)}`);
      const { docs, ...paginationData } = response.data;
      
      set({
        events: docs,
        pagination: paginationData,
        isLoading: false
      });
    } catch (error) {
      console.error('Error searching events:', error);
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