import { create } from 'zustand';
import Taro from '@tarojs/taro';
import type { FamilyMember, ChecklistItem, VerifiedBenefit } from '@/types/benefit';
import { familyMembersData } from '@/data/family';

const STORAGE_KEYS = {
  largeTextMode: 'app_large_text_mode',
  familyMembers: 'app_family_members',
  claimedVoucherIds: 'app_claimed_voucher_ids',
  checklistItems: 'app_checklist_items',
  verifiedBenefits: 'app_verified_benefits',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = Taro.getStorageSync(key);
    if (raw) return JSON.parse(raw) as T;
  } catch (e) {
    console.error('[Storage] 读取失败:', key, e);
  }
  return fallback;
}

function saveToStorage(key: string, value: unknown): void {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    console.error('[Storage] 写入失败:', key, e);
  }
}

const initLargeText = loadFromStorage<boolean>(STORAGE_KEYS.largeTextMode, false);
const initFamily = loadFromStorage<FamilyMember[]>(STORAGE_KEYS.familyMembers, familyMembersData);
const initClaimedIds = loadFromStorage<string[]>(STORAGE_KEYS.claimedVoucherIds, ['4']);
const initChecklist = loadFromStorage<ChecklistItem[]>(STORAGE_KEYS.checklistItems, []);
const initVerified = loadFromStorage<VerifiedBenefit[]>(STORAGE_KEYS.verifiedBenefits, []);

interface AppState {
  largeTextMode: boolean;
  toggleLargeText: () => void;

  familyMembers: FamilyMember[];
  addFamilyMember: (member: FamilyMember) => boolean;
  removeFamilyMember: (id: string) => void;

  claimedVoucherIds: string[];
  claimVoucher: (id: string) => void;
  isVoucherClaimed: (id: string) => boolean;

  checklistItems: ChecklistItem[];
  addChecklistItem: (item: Omit<ChecklistItem, 'id' | 'addedAt'>) => void;
  toggleChecklistItem: (id: string) => void;
  clearChecklist: () => void;
  isInChecklist: (source: string, sourceId: string) => boolean;

  verifiedBenefits: VerifiedBenefit[];
  addVerifiedBenefit: (vb: VerifiedBenefit) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  largeTextMode: initLargeText,
  toggleLargeText: () => {
    const next = !get().largeTextMode;
    saveToStorage(STORAGE_KEYS.largeTextMode, next);
    set({ largeTextMode: next });
  },

  familyMembers: initFamily,
  addFamilyMember: (member) => {
    const existing = get().familyMembers;
    if (existing.some((m) => m.phone === member.phone)) {
      return false;
    }
    const next = [...existing, member];
    saveToStorage(STORAGE_KEYS.familyMembers, next);
    set({ familyMembers: next });
    return true;
  },
  removeFamilyMember: (id) => {
    const next = get().familyMembers.filter((m) => m.id !== id);
    saveToStorage(STORAGE_KEYS.familyMembers, next);
    set({ familyMembers: next });
  },

  claimedVoucherIds: initClaimedIds,
  claimVoucher: (id) => {
    const current = get().claimedVoucherIds;
    if (current.includes(id)) return;
    const next = [...current, id];
    saveToStorage(STORAGE_KEYS.claimedVoucherIds, next);
    set({ claimedVoucherIds: next });
  },
  isVoucherClaimed: (id) => get().claimedVoucherIds.includes(id),

  checklistItems: initChecklist,
  addChecklistItem: (item) => {
    const existing = get().checklistItems;
    if (item.sourceId && existing.some((i) => i.source === item.source && i.sourceId === item.sourceId)) {
      return;
    }
    if (existing.some((i) => i.name === item.name && i.source === item.source)) {
      return;
    }
    const newItem: ChecklistItem = {
      ...item,
      id: `cl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      addedAt: new Date().toISOString().slice(0, 10),
    };
    const next = [...existing, newItem];
    saveToStorage(STORAGE_KEYS.checklistItems, next);
    set({ checklistItems: next });
  },
  toggleChecklistItem: (id) => {
    const next = get().checklistItems.map((item) =>
      item.id === id
        ? {
            ...item,
            isCompleted: !item.isCompleted,
            completedAt: !item.isCompleted ? new Date().toISOString().slice(0, 16) : undefined,
          }
        : item
    );
    saveToStorage(STORAGE_KEYS.checklistItems, next);
    set({ checklistItems: next });
  },
  clearChecklist: () => {
    saveToStorage(STORAGE_KEYS.checklistItems, []);
    set({ checklistItems: [] });
  },
  isInChecklist: (source, sourceId) => {
    return get().checklistItems.some(
      (i) => i.source === source && i.sourceId === sourceId
    );
  },

  verifiedBenefits: initVerified,
  addVerifiedBenefit: (vb) => {
    const next = [...get().verifiedBenefits, vb];
    saveToStorage(STORAGE_KEYS.verifiedBenefits, next);
    set({ verifiedBenefits: next });
  },
}));
