import { create } from 'zustand';
import type { ChecklistItem } from '@/types/benefit';
import { checklistItemsData } from '@/data/recommendations';

interface AppState {
  largeTextMode: boolean;
  toggleLargeText: () => void;
  checklistItems: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  largeTextMode: false,
  toggleLargeText: () =>
    set((state) => ({ largeTextMode: !state.largeTextMode })),
  checklistItems: checklistItemsData,
  toggleChecklistItem: (id: string) =>
    set((state) => ({
      checklistItems: state.checklistItems.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      ),
    })),
}));
