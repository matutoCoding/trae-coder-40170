import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { benefitsData } from '@/data/benefits';
import BenefitCard from '@/components/BenefitCard';
import type { Benefit } from '@/types/benefit';
import styles from './index.module.scss';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'health', label: '健康' },
  { key: 'medication', label: '用药' },
  { key: 'equipment', label: '器械' },
  { key: 'consultation', label: '咨询' },
];

const BenefitsPage: React.FC = () => {
  const { largeTextMode } = useAppStore();
  const [activeTab, setActiveTab] = useState('all');

  const filteredBenefits: Benefit[] =
    activeTab === 'all'
      ? benefitsData
      : benefitsData.filter((b) => b.category === activeTab);

  const availableCount = benefitsData.filter(
    (b) => b.status === 'available' || b.status === 'expiring'
  ).length;
  const usedCount = benefitsData.filter((b) => b.status === 'used').length;
  const expiredCount = benefitsData.filter((b) => b.status === 'expired').length;

  const handleCardClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/benefit-detail/index?id=${id}` });
  };

  return (
    <View className={classnames(styles.container, largeTextMode && styles.largeText)}>
      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(
              styles.tab,
              activeTab === tab.key && styles.tabActive
            )}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className={styles.tabText}>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.summary}>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryCount}>{availableCount}</Text>
          <Text className={styles.summaryLabel}>可领取</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryCount}>{usedCount}</Text>
          <Text className={styles.summaryLabel}>已使用</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryCount}>{expiredCount}</Text>
          <Text className={styles.summaryLabel}>已过期</Text>
        </View>
      </View>

      <ScrollView scrollY style={{ height: 'calc(100vh - 360rpx)' }}>
        {filteredBenefits.map((benefit) => (
          <BenefitCard
            key={benefit.id}
            benefit={benefit}
            largeText={largeTextMode}
            onClick={handleCardClick}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default BenefitsPage;
