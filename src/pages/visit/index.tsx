import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { storesData } from '@/data/stores';
import styles from './index.module.scss';

const VisitPage: React.FC = () => {
  const { largeTextMode, checklistItems, toggleChecklistItem } = useAppStore();
  const [showQRCode, setShowQRCode] = useState(false);

  const completedCount = checklistItems.filter((i) => i.isCompleted).length;

  const handleGenerateChecklist = () => {
    const unchecked = checklistItems.filter((i) => !i.isCompleted);
    if (unchecked.length === 0) {
      Taro.showToast({ title: '清单已全部完成', icon: 'success' });
      return;
    }
    const listText = unchecked.map((i) => `• ${i.name}`).join('\n');
    Taro.setClipboardData({
      data: `到店清单：\n${listText}`,
      success: () => {
        Taro.showToast({ title: '清单已复制', icon: 'success' });
        console.info('[VisitPage] 生成到店清单:', listText);
      },
    });
  };

  const handleShowQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  const handleStoreClick = (storeId: string) => {
    Taro.navigateTo({ url: `/pages/store-list/index?id=${storeId}` });
  };

  return (
    <View className={classnames(styles.container, largeTextMode && styles.largeText)}>
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📋 到店清单</Text>
          <View className={styles.qrCodeButton} onClick={handleShowQRCode}>
            <Text className={styles.qrCodeButtonText}>
              {showQRCode ? '收起码' : '出示权益码'}
            </Text>
          </View>
        </View>

        {showQRCode && (
          <View className={styles.qrCodeSection}>
            <View className={styles.qrCodePlaceholder}>
              <View className={styles.qrCodeInner}>
                <Text className={styles.qrCodeIcon}>📱</Text>
                <Text className={styles.qrCodeText}>权益码</Text>
                <Text className={styles.qrCodeDesc}>
                  到店后出示此码{'\n'}店员扫码确认领取
                </Text>
              </View>
            </View>
          </View>
        )}

        <View className={styles.checklistCard}>
          {checklistItems.map((item) => (
            <View className={styles.checkItem} key={item.id}>
              <View
                className={classnames(
                  styles.checkBox,
                  item.isCompleted && styles.checkBoxChecked
                )}
                onClick={() => toggleChecklistItem(item.id)}
              >
                {item.isCompleted && (
                  <Text className={styles.checkBoxIcon}>✓</Text>
                )}
              </View>
              <View className={styles.checkItemInfo}>
                <Text
                  className={styles.checkItemName}
                  style={{
                    textDecoration: item.isCompleted ? 'line-through' : 'none',
                    color: item.isCompleted ? '#CCCCCC' : '#1A1A1A',
                  }}
                >
                  {item.name}
                </Text>
                <Text className={styles.checkItemCategory}>{item.category}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className={styles.generateButton} onClick={handleGenerateChecklist}>
          <Text className={styles.generateButtonText}>
            一键生成到店清单（已完成{completedCount}/{checklistItems.length}）
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>🏪 附近药店</Text>
          <Text
            className={styles.qrCodeButtonText}
            onClick={() => Taro.navigateTo({ url: '/pages/store-list/index' })}
          >
            查看全部 ›
          </Text>
        </View>
        {storesData.slice(0, 3).map((store) => (
          <View
            className={styles.storeCard}
            key={store.id}
            onClick={() => handleStoreClick(store.id)}
          >
            <View className={styles.storeInfo}>
              <Text className={styles.storeName}>{store.name}</Text>
              <Text className={styles.storeAddress}>{store.address}</Text>
              <View className={styles.serviceTags}>
                {store.availableServices.map((service, idx) => (
                  <View className={styles.serviceTag} key={idx}>
                    <Text className={styles.serviceTagText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Text className={styles.storeDistance}>{store.distance}</Text>
              <Text className={styles.storeArrow}>›</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default VisitPage;
