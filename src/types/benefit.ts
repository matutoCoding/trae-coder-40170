export interface Benefit {
  id: string;
  name: string;
  category: 'health' | 'medication' | 'equipment' | 'consultation';
  status: 'available' | 'used' | 'expired' | 'expiring';
  briefDescription: string;
  canDo: string;
  cannotDo: string;
  howToSay: string;
  expiryDate: string;
  icon: string;
}

export interface Voucher {
  id: string;
  name: string;
  description: string;
  value: string;
  status: 'claimable' | 'claimed' | 'expired';
  expiryDate: string;
  icon: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  availableServices: string[];
  openHours: string;
}

export interface Member {
  name: string;
  level: string;
  levelIcon: string;
  points: number;
  phone: string;
  joinDate: string;
}

export interface MedicationReminder {
  id: string;
  name: string;
  lastPurchaseDate: string;
  nextPurchaseDate: string;
  dosage: string;
  isUrgent: boolean;
}

export interface Recommendation {
  id: string;
  name: string;
  reason: string;
  benefit: string;
  category: '慢病药补货' | '家用器械' | '日常备药';
  icon: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  avatar: string;
  boundDate: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  isCompleted: boolean;
  source: 'benefit' | 'recommendation' | 'reminder' | 'manual';
  sourceId?: string;
  addedAt: string;
  completedAt?: string;
}

export interface PaymentTip {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
}

export interface VerifiedBenefit {
  benefitId: string;
  benefitName: string;
  benefitIcon: string;
  verifiedAt: string;
  storeName: string;
}
