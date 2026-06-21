import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { storesData } from '@/data/stores';
import styles from './index.module.scss';

const filterOptions = [
  { key: 'all', label: '全部' },
  { key: '门诊统筹', label: '门诊统筹' },
  { key: '慢病用药', label: '慢病用药' },
  { key: '药师咨询', label: '药师咨询' },
];

const StoreListPage: React.FC = () => {
  const { largeTextMode } = useAppStore();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredStores =
    activeFilter === 'all'
      ? storesData
      : storesData.filter((s) => s.availableServices.includes(activeFilter));

  return (
    <View className={classnames(styles.container, largeTextMode && styles.largeText)}>
      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Text className={styles.searchPlaceholder}>搜索药店名称或地址</Text>
      </View>

      <View className={styles.filterRow}>
        {filterOptions.map((opt) => (
          <View
            key={opt.key}
            className={classnames(
              styles.filterTag,
              activeFilter === opt.key && styles.filterTagActive
            )}
            onClick={() => setActiveFilter(opt.key)}
          >
            <Text className={styles.filterTagText}>{opt.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY style={{ height: 'calc(100vh - 300rpx)' }}>
        {filteredStores.map((store) => (
          <View className={styles.storeCard} key={store.id}>
            <View className={styles.storeHeader}>
              <Text className={styles.storeName}>{store.name}</Text>
              <Text className={styles.storeDistance}>{store.distance}</Text>
            </View>
            <Text className={styles.storeAddress}>{store.address}</Text>
            <Text className={styles.storeHours}>
              营业时间：{store.openHours}
            </Text>
            <View className={styles.serviceTags}>
              {store.availableServices.map((service, idx) => (
                <View className={styles.serviceTag} key={idx}>
                  <Text className={styles.serviceTagText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default StoreListPage;
