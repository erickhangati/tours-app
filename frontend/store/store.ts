import { create } from 'zustand';
import { User, Tour, Tours } from '../data/type';

interface ToursState {
  tour: Tour | null;
  setTour: (tour: Tour | null) => void;
  tours: Tours | null;
  setTours: (tour: Tours | null) => void;
}

export const useToursStore = create<ToursState>()((set) => ({
  tour: null,
  setTour: (tour) => set({ tour }),
  tours: null,
  setTours: (tours) => set({ tours }),
}));

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
