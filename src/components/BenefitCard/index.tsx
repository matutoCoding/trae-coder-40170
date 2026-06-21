import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { Benefit } from '@/types/benefit';
import styles from './index.module.scss';

interface BenefitCardProps {
  benefit: Benefit;
  largeText?: boolean;
  onClick?: (id: string) => void;
}

const categoryMap: Record<string, string> = {
  health: '健康服务',
  medication: '药品补贴',
  equipment: '器械服务',
  consultation: '咨询指导',
};

const statusMap: Record<string, { label: string; style: string }> = {
  available: { label: '可领取', style: 'available' },
  used: { label: '已使用', style: 'used' },
  expired: { label: '已过期', style: 'expired' },
  expiring: { label: '即将过期', style: 'expiring' },
};

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit, largeText, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = statusMap[benefit.status] || statusMap.available;

  const handleToggle = (e: any) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleClick = () => {
    if (onClick && !expanded) {
      onClick(benefit.id);
    }
  };

  return (
    <View
      className={classnames(styles.card, largeText && styles.largeText)}
      onClick={handleClick}
    >
      <View className={styles.cardHeader}>
        <View className={styles.cardTitleRow}>
          <Text className={styles.cardIcon}>{benefit.icon}</Text>
          <Text className={styles.cardName}>{benefit.name}</Text>
        </View>
        <View className={styles.cardMeta}>
          <View
            className={classnames(
              styles.categoryTag,
              styles[`tag_${benefit.category}`]
            )}
          >
            <Text className={styles.categoryTagText}>
              {categoryMap[benefit.category]}
            </Text>
          </View>
          <View
            className={classnames(
              styles.statusTag,
              styles[`status_${statusInfo.style}`]
            )}
          >
            <Text className={styles.statusTagText}>{statusInfo.label}</Text>
          </View>
        </View>
      </View>

      <Text className={styles.cardDesc}>{benefit.briefDescription}</Text>

      <View className={styles.expiryRow}>
        <Text className={styles.expiryText}>
          有效期至 {benefit.expiryDate}
        </Text>
      </View>

      <View className={styles.expandButton} onClick={handleToggle}>
        <Text className={styles.expandButtonText}>
          {expanded ? '收起详情 ▲' : '查看详情 ▼'}
        </Text>
      </View>

      {expanded && (
        <View className={styles.detailSection}>
          <View className={styles.detailBlock}>
            <View className={classnames(styles.detailLabel, styles.canDo)}>
              <Text className={styles.detailLabelText}>✅ 能用来做什么</Text>
            </View>
            <Text className={styles.detailContent}>{benefit.canDo}</Text>
          </View>

          <View className={styles.detailBlock}>
            <View className={classnames(styles.detailLabel, styles.cannotDo)}>
              <Text className={styles.detailLabelText}>❌ 不能用来做什么</Text>
            </View>
            <Text className={styles.detailContent}>{benefit.cannotDo}</Text>
          </View>

          <View className={styles.detailBlock}>
            <View className={classnames(styles.detailLabel, styles.howToSay)}>
              <Text className={styles.detailLabelText}>💬 到店怎么说</Text>
            </View>
            <Text className={styles.detailContent}>{benefit.howToSay}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default BenefitCard;
