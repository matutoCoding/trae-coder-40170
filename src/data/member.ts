import type { Member, MedicationReminder, PaymentTip } from '@/types/benefit';

export const memberData: Member = {
  name: '张秀兰',
  level: '金卡会员',
  levelIcon: '🥇',
  points: 3200,
  phone: '138****5678',
  joinDate: '2022-03-15',
};

export const medicationReminders: MedicationReminder[] = [
  {
    id: '1',
    name: '缬沙坦胶囊(降压药)',
    lastPurchaseDate: '2025-05-10',
    nextPurchaseDate: '2025-06-25',
    dosage: '每日1次，每次1粒',
    isUrgent: true,
  },
  {
    id: '2',
    name: '二甲双胍片(降糖药)',
    lastPurchaseDate: '2025-05-15',
    nextPurchaseDate: '2025-07-01',
    dosage: '每日2次，每次1片',
    isUrgent: false,
  },
  {
    id: '3',
    name: '碳酸钙D3片(补钙)',
    lastPurchaseDate: '2025-04-20',
    nextPurchaseDate: '2025-06-30',
    dosage: '每日1次，每次1片',
    isUrgent: false,
  },
];

export const paymentTips: PaymentTip[] = [
  {
    id: '1',
    title: '个账余额要先查再花',
    description: '到店消费前，先查询医保个账余额，避免余额不足无法支付',
    type: 'info',
  },
  {
    id: '2',
    title: '保健品不能用个账',
    description: '医保个账不能购买保健品、食品、化妆品等非药品类商品',
    type: 'warning',
  },
  {
    id: '3',
    title: '处方药需带处方',
    description: '购买处方药时需出示医生处方，建议提前准备好处方或处方照片',
    type: 'info',
  },
  {
    id: '4',
    title: '保留购药小票',
    description: '每次购药后保留小票，方便后续报销和用药记录查询',
    type: 'success',
  },
];
