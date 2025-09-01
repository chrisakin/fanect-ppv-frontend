import { create } from 'zustand';

interface SessionData {
  streampassId: string;
  sessionToken: string;
  isActive: boolean;
  lastHeartbeat: Date;
}

interface StreampassSessionState {
  sessions: Map<string, SessionData>;
  addSession: (streampassId: string, sessionToken: string) => void;
  removeSession: (streampassId: string) => void;
  updateHeartbeat: (streampassId: string) => void;
  getSession: (streampassId: string) => SessionData | null;
  isSessionActive: (streampassId: string) => boolean;
  getSessionToken: (streampassId: string) => string | null;
  clearAllSessions: () => void;
}

export const useStreampassSessionStore = create<StreampassSessionState>((set, get) => ({
  sessions: new Map(),

  addSession: (streampassId: string, sessionToken: string) => {
    set((state) => {
      const newSessions = new Map(state.sessions);
      newSessions.set(streampassId, {
        streampassId,
        sessionToken,
        isActive: true,
        lastHeartbeat: new Date()
      });
      return { sessions: newSessions };
    });
  },

  removeSession: (streampassId: string) => {
    set((state) => {
      const newSessions = new Map(state.sessions);
      newSessions.delete(streampassId);
      return { sessions: newSessions };
    });
  },

  updateHeartbeat: (streampassId: string) => {
    set((state) => {
      const newSessions = new Map(state.sessions);
      const session = newSessions.get(streampassId);
      if (session) {
        newSessions.set(streampassId, {
          ...session,
          lastHeartbeat: new Date()
        });
      }
      return { sessions: newSessions };
    });
  },

  getSession: (streampassId: string) => {
    return get().sessions.get(streampassId) || null;
  },

  isSessionActive: (streampassId: string) => {
    const session = get().sessions.get(streampassId);
    return session?.isActive || false;
  },

  getSessionToken: (streampassId: string) => {
    const session = get().sessions.get(streampassId);
    return session?.sessionToken || null;
  },

  clearAllSessions: () => {
    set({ sessions: new Map() });
  },
}));