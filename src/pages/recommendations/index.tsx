import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { recommendationsData } from '@/data/recommendations';
import styles from './index.module.scss';

const categoryConfig: Record<string, { icon: string; label: string }> = {
  '慢病药补货': { icon: '💊', label: '慢病药补货' },
  '家用器械': { icon: '🩸', label: '家用器械' },
  '日常备药': { icon: '🏠', label: '日常备药' },
};

const categoryOrder = ['慢病药补货', '家用器械', '日常备药'];

const RecommendationsPage: React.FC = () => {
  const { largeTextMode, addChecklistItem, isInChecklist } = useAppStore();

  const handleAddToChecklist = (rec: typeof recommendationsData[0]) => {
    if (isInChecklist('recommendation', rec.id)) return;
    addChecklistItem({
      name: rec.name,
      category: rec.category,
      isCompleted: false,
      source: 'recommendation',
      sourceId: rec.id,
    });
    Taro.showToast({ title: '已加入到店清单', icon: 'success' });
    console.info('[Recommendations] 加入清单:', rec.name);
  };

  return (
    <View className={classnames(styles.container, largeTextMode && styles.largeText)}>
      <ScrollView scrollY style={{ height: 'calc(100vh - 40rpx)' }}>
        {categoryOrder.map((cat) => {
          const config = categoryConfig[cat];
          const items = recommendationsData.filter((r) => r.category === cat);
          if (items.length === 0) return null;

          return (
            <View className={styles.categorySection} key={cat}>
              <View className={styles.categoryHeader}>
                <Text className={styles.categoryIcon}>{config.icon}</Text>
                <Text className={styles.categoryTitle}>{config.label}</Text>
              </View>
              {items.map((rec) => {
                const inList = isInChecklist('recommendation', rec.id);
                return (
                  <View className={styles.recCard} key={rec.id}>
                    <View className={styles.recIconWrap}>
                      <Text className={styles.recIcon}>{rec.icon}</Text>
                    </View>
                    <View className={styles.recInfo}>
                      <Text className={styles.recName}>{rec.name}</Text>
                      <Text className={styles.recReason}>{rec.reason}</Text>
                      <Text className={styles.recBenefit}>{rec.benefit}</Text>
                    </View>
                    <View
                      className={classnames(
                        styles.addButton,
                        inList && styles.addedButton
                      )}
                      onClick={() => handleAddToChecklist(rec)}
                    >
                      <Text
                        className={classnames(
                          styles.addButtonText,
                          inList && styles.addedButtonText
                        )}
                      >
                        {inList ? '已加入' : '加入清单'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default RecommendationsPage;
