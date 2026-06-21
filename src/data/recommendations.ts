import type { Recommendation, Voucher, ChecklistItem } from '@/types/benefit';

export const recommendationsData: Recommendation[] = [
  {
    id: '1',
    name: '夏季防暑药品套装',
    reason: '夏季高温来临，建议备好防暑药品',
    benefit: '会员专享8折',
    category: '健康防护',
    icon: '☀️',
  },
  {
    id: '2',
    name: '血压计试纸耗材',
    reason: '试纸需定期更换，保证测量准确',
    benefit: '可用医保个账支付',
    category: '器械耗材',
    icon: '🩸',
  },
  {
    id: '3',
    name: '维生素D补充剂',
    reason: '骨质疏松预防，促进钙吸收',
    benefit: '慢病补贴可用',
    category: '营养补充',
    icon: '💊',
  },
  {
    id: '4',
    name: '清凉油与风油精',
    reason: '夏日防蚊驱虫、提神醒脑',
    benefit: '第二件半价',
    category: '日常用药',
    icon: '🧴',
  },
  {
    id: '5',
    name: '藿香正气水',
    reason: '夏季肠胃不适常用药品',
    benefit: '可用医保个账支付',
    category: '日常用药',
    icon: '🌿',
  },
];

export const vouchersData: Voucher[] = [
  {
    id: '1',
    name: '满减券',
    description: '满100元减20元',
    value: '减20元',
    status: 'claimable',
    expiryDate: '2025-08-31',
    icon: '🎫',
  },
  {
    id: '2',
    name: '慢病药专享券',
    description: '慢病用药享8折',
    value: '8折',
    status: 'claimable',
    expiryDate: '2025-09-30',
    icon: '💊',
  },
  {
    id: '3',
    name: '体检抵扣券',
    description: '体检费用抵扣50元',
    value: '抵50元',
    status: 'claimable',
    expiryDate: '2025-07-31',
    icon: '🩺',
  },
  {
    id: '4',
    name: '中药调理券',
    description: '中药满200减40',
    value: '减40元',
    status: 'claimed',
    expiryDate: '2025-10-31',
    icon: '🌿',
  },
  {
    id: '5',
    name: '理疗体验券',
    description: '中医理疗首次免费',
    value: '免费',
    status: 'claimable',
    expiryDate: '2025-08-15',
    icon: '💆',
  },
];

export const checklistItemsData: ChecklistItem[] = [
  {
    id: '1',
    name: '血压计校准',
    category: '器械服务',
    isCompleted: false,
  },
  {
    id: '2',
    name: '慢病药补货（缬沙坦胶囊）',
    category: '药品购买',
    isCompleted: false,
  },
  {
    id: '3',
    name: '药师用药咨询',
    category: '咨询服务',
    isCompleted: false,
  },
  {
    id: '4',
    name: '血糖检测',
    category: '健康检查',
    isCompleted: false,
  },
  {
    id: '5',
    name: '领取慢病用药补贴',
    category: '权益领取',
    isCompleted: false,
  },
];
