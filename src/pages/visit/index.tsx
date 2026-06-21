import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { storesData } from '@/data/stores';
import styles from './index.module.scss';

const sourceLabelMap: Record<string, { icon: string; label: string }> = {
  benefit: { icon: '🏥', label: '权益' },
  recommendation: { icon: '🛒', label: '推荐' },
  reminder: { icon: '💊', label: '复购' },
  manual: { icon: '✍️', label: '手动' },
};

const VisitPage: React.FC = () => {
  const {
    largeTextMode,
    checklistItems,
    toggleChecklistItem,
    clearChecklist,
    verifiedBenefits,
    addVerifiedBenefit,
  } = useAppStore();
  const [showQRCode, setShowQRCode] = useState(false);

  const completedCount = checklistItems.filter((i) => i.isCompleted).length;
  const pendingItems = checklistItems.filter((i) => !i.isCompleted);

  const handleGenerateChecklist = () => {
    const pending = checklistItems.filter((i) => !i.isCompleted);
    if (pending.length === 0 && checklistItems.length === 0) {
      Taro.showToast({ title: '清单为空，请先添加项目', icon: 'none' });
      return;
    }
    const items = pending.length > 0 ? pending : checklistItems;
    const listText = items
      .map((i) => {
        const src = sourceLabelMap[i.source];
        return `• ${i.name}（${src?.label || i.category}）`;
      })
      .join('\n');
    Taro.setClipboardData({
      data: `📋 到店清单\n${listText}`,
      success: () => {
        Taro.showToast({ title: '清单已复制，可发给家属', icon: 'success' });
        console.info('[VisitPage] 复制到店清单:', listText);
      },
    });
  };

  const handleShowQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  const handleVerifyBenefit = (item: typeof checklistItems[0]) => {
    addVerifiedBenefit({
      benefitId: item.sourceId || item.id,
      benefitName: item.name,
      benefitIcon: '✅',
      verifiedAt: new Date().toISOString().slice(0, 16),
      storeName: '国大药房(朝阳路店)',
    });
    if (!item.isCompleted) {
      toggleChecklistItem(item.id);
    }
    Taro.showToast({ title: '已核销确认', icon: 'success' });
  };

  const handleClearChecklist = () => {
    if (checklistItems.length === 0) return;
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空到店清单吗？已核销的记录会保留。',
      success: (res) => {
        if (res.confirm) {
          clearChecklist();
          Taro.showToast({ title: '已清空', icon: 'success' });
        }
      },
    });
  };

  const handleStoreClick = (storeId: string) => {
    Taro.navigateTo({ url: `/pages/store-list/index?id=${storeId}` });
  };

  return (
    <View className={classnames(styles.container, largeTextMode && styles.largeText)}>
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            📋 到店清单（{completedCount}/{checklistItems.length}）
          </Text>
          <View style={{ display: 'flex', gap: '16rpx', alignItems: 'center' }}>
            {checklistItems.length > 0 && (
              <View className={styles.clearButton} onClick={handleClearChecklist}>
                <Text className={styles.clearButtonText}>清空</Text>
              </View>
            )}
            <View className={styles.qrCodeButton} onClick={handleShowQRCode}>
              <Text className={styles.qrCodeButtonText}>
                {showQRCode ? '收起码' : '权益码'}
              </Text>
            </View>
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

        {checklistItems.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>清单为空</Text>
            <Text className={styles.emptyHint}>
              可从权益详情、今日推荐、复购提醒中添加
            </Text>
          </View>
        ) : (
          <View className={styles.checklistCard}>
            {checklistItems.map((item) => {
              const srcInfo = sourceLabelMap[item.source] || sourceLabelMap.manual;
              return (
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
                    <View className={styles.checkItemMeta}>
                      <View className={styles.sourceTag}>
                        <Text className={styles.sourceTagText}>
                          {srcInfo.icon} {srcInfo.label}
                        </Text>
                      </View>
                      <Text className={styles.checkItemCategory}>{item.category}</Text>
                      {item.isCompleted && item.completedAt && (
                        <Text className={styles.completedTime}>
                          完成于 {item.completedAt}
                        </Text>
                      )}
                    </View>
                  </View>
                  {!item.isCompleted && item.source === 'benefit' && (
                    <View
                      className={styles.verifyButton}
                      onClick={() => handleVerifyBenefit(item)}
                    >
                      <Text className={styles.verifyButtonText}>核销</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {checklistItems.length > 0 && (
          <View style={{ display: 'flex', gap: '16rpx', marginTop: '24rpx' }}>
            <View
              className={styles.generateButton}
              style={{ flex: 1 }}
              onClick={handleGenerateChecklist}
            >
              <Text className={styles.generateButtonText}>
                复制清单给家属
              </Text>
            </View>
          </View>
        )}
      </View>

      {verifiedBenefits.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>✅ 已核销权益</Text>
          <View className={styles.verifiedCard}>
            {verifiedBenefits.map((vb, idx) => (
              <View className={styles.verifiedItem} key={idx}>
                <View className={styles.verifiedIcon}>
                  <Text>✅</Text>
                </View>
                <View className={styles.verifiedInfo}>
                  <Text className={styles.verifiedName}>{vb.benefitName}</Text>
                  <Text className={styles.verifiedMeta}>
                    核销于 {vb.verifiedAt} · {vb.storeName}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>🏪 附近药店</Text>
          <Text
            className={styles.seeAllText}
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
