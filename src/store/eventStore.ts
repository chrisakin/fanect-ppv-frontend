import { create } from 'zustand';
import axios from '@/lib/axios';
import { isAuthenticated } from '@/lib/auth';

/**
 * Event
 *
 * Represents a complete event object returned from the backend.
 *  - _id: MongoDB/unique identifier
 *  - name: Event title
 *  - date, time: Event start date and time (strings)
 *  - description: Event description
 *  - bannerUrl, watermarkUrl, trailerUrl: Media URLs
 *  - price: Object with currency and amount
 *  - eventDateTime: Formatted datetime string
 *  - canWatchSavedStream: Whether recording is available for replay
 *  - adminStatus: Status from admin dashboard (e.g. 'approved', 'pending')
 *  - chatRoomArn, chatToken: AWS IVS chat room identifiers
 *  - playbackUrl: URL for accessing event replay
 *  - hasStreamPass: Whether event requires a subscription/pass to view
 *  - timezone, streamingDeviceType: Optional metadata fields
 */
export interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  bannerUrl: string;
  watermarkUrl: string;
  trailerUrl: string;
  price: {currency: string, amount: string};
  eventDateTime: string;
  canWatchSavedStream: boolean;
  adminStatus: string;
  chatRoomArn: string;
  playbackUrl: string;
  chatToken: string;
  hasStreamPass: boolean;
  timezone?: string;
  streamingDeviceType?: string;
}

/**
 * PaginationData
 *
 * Response metadata for paginated API endpoints.
 *  - totalDocs: Total number of items across all pages
 *  - totalPages: Total number of pages available
 *  - currentPage: Current page number (1-indexed)
 *  - nextPage, previousPage: Page numbers for navigation or null if not available
 *  - limit: Number of items per page
 */
interface PaginationData {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  limit: number;
}

/**
 * EventState
 *
 * Zustand store state for managing event data across the application.
 *  - events: Array of Event objects (varies based on fetch method)
 *  - isLoading: Loading state for list fetches
 *  - isDeleteLoading, isUpdateLoading: Loading states for mutations
 *  - pagination: Pagination metadata for current event list
 *  - selectedEvent: Single event selected for detail view/interaction
 *  - singleEvent: Event fetched individually (not part of list)
 *  - singleStreampass: Streampass/subscription identifier for purchased events
 *  - Various fetch methods: Populate events array based on filter/search
 *  - Mutation methods: deleteEvent, updateEvent
 *  - UI methods: setSelectedEvent, resetSingleEvent
 */
interface EventState {
  events: Event[];
  isLoading: boolean;
  isDeleteLoading: boolean;
  isUpdateLoading: boolean;
  pagination: PaginationData;
  selectedEvent: Event | null;
  singleEvent: Event | null;
  singleStreampass: string | null;
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
  resetSingleEvent: () => void;
}

/**
 * useEventStore
 *
 * Global Zustand store for event management with methods for:
 *  - Fetching events (upcoming, live, my events, search)
 *  - Managing single event details
 *  - Creating, updating, and deleting events
 *  - Handling pagination and loading states
 */
export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: false,
  isDeleteLoading: false,
  isUpdateLoading: false,
  selectedEvent: null,
  singleEvent: null,
  singleStreampass: null,
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
      const response = await axios.get(isAuthenticated() ? `/events/auth/upcoming?page=${page}&limit=12` :`/events/upcoming?page=${page}&limit=12`);
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
      const response = await axios.get(isAuthenticated() ? `/events/live?page=${page}&limit=12` : `/events/no-auth/live?page=${page}&limit=12`);
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
  resetSingleEvent: () => set({ singleEvent: null, isLoading: true}),
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
      const response = await axios.get(isAuthenticated() ? `/events/auth/${id}` : `/events/${id}`);
      set({ singleEvent: response.data.event, isLoading: false });
    } catch (error) {
      console.error('Error fetching single event:', error);
      set({ singleEvent: null, isLoading: false });
    }
  },
  fetchPurchasedEvent: async (id: string) => {
    try {
      // Check sessionStorage cache first
      const cacheKey = `purchased_event_${id}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        console.log('✅ Using cached purchased event data for:', id);
        const cachedData = JSON.parse(cached);
        set({
          singleEvent: cachedData.event,
          isLoading: false,
          singleStreampass: cachedData.streampassId
        });
        return;
      }

      set({ isLoading: true });
      const response = await axios.get(`/streampass/get-one-event/${id}`);

      // Cache the response
      const cacheData = {
        event: response.data.streampass.event,
        streampassId: response.data.streampass._id
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log('💾 Cached purchased event data for:', id);

      set({
        singleEvent: response.data.streampass.event,
        isLoading: false,
        singleStreampass: response.data.streampass._id
      });
    } catch (error) {
      console.error('Error fetching purchased event:', error);
      set({ singleEvent: null, isLoading: false });
      throw error;
    }
  },
  searchEvents: async (query: string, page = 1) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(isAuthenticated() ? `/events/auth/upcoming?page=${page}&limit=12&search=${encodeURIComponent(query)}`: `/events/upcoming?page=${page}&limit=12&search=${encodeURIComponent(query)}`);
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