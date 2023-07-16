import { create } from 'zustand';
import { Tour, Tours } from '../data/type';

export interface Data {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostState {
  post: Data | null;
  setPost: (post: Data | ((prevPost: Data | null) => Data)) => void;
}

export const usePostStore = create<PostState>()((set) => ({
  post: null,
  setPost: (post: Data | ((prevPost: Data | null) => Data)) => {
    if (typeof post === 'function') {
      set((state) => ({ post: post(state.post) }));
    } else {
      set({ post });
    }
  },
}));

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
