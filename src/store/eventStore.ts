import { create } from 'zustand';
import axios from '@/lib/axios';

interface Event {
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
  pagination: PaginationData;
  fetchUpcomingEvents: (page?: number) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: false,
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
  }
}));