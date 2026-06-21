import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { benefitsData } from '@/data/benefits';
import styles from './index.module.scss';

const categoryMap: Record<string, string> = {
  health: '健康服务',
  medication: '药品补贴',
  equipment: '器械服务',
  consultation: '咨询指导',
};

const statusMap: Record<string, string> = {
  available: '可领取',
  used: '已使用',
  expired: '已过期',
  expiring: '即将过期',
};

const BenefitDetailPage: React.FC = () => {
  const { largeTextMode, addChecklistItem, isInChecklist } = useAppStore();

  const params = Taro.getCurrentInstance().router?.params;
  const benefitId = params?.id || '1';
  const benefit = benefitsData.find((b) => b.id === benefitId) || benefitsData[0];

  const inList = isInChecklist('benefit', benefit.id);

  const handleAddToChecklist = () => {
    if (inList) return;
    addChecklistItem({
      name: `领取：${benefit.name}`,
      category: categoryMap[benefit.category],
      isCompleted: false,
      source: 'benefit',
      sourceId: benefit.id,
    });
    Taro.showToast({ title: '已加入到店清单', icon: 'success' });
  };

  const handleShareToFamily = () => {
    const familyMembers = useAppStore.getState().familyMembers;
    if (familyMembers.length === 0) {
      Taro.showToast({ title: '请先绑定家属', icon: 'none' });
      Taro.navigateTo({ url: '/pages/family-bind/index' });
      return;
    }
    Taro.setClipboardData({
      data: `【康享权益】${benefit.name}\n${benefit.briefDescription}\n\n✅ 能做什么：${benefit.canDo}\n❌ 不能做什么：${benefit.cannotDo}\n💬 到店怎么说：${benefit.howToSay}`,
      success: () => {
        Taro.showToast({ title: '权益信息已复制，可发给家属', icon: 'success' });
        console.info('[BenefitDetail] 分享权益给家属:', benefit.id);
      },
    });
  };

  return (
    <View className={classnames(styles.container, largeTextMode && styles.largeText)}>
      <View className={styles.header}>
        <Text className={styles.benefitIcon}>{benefit.icon}</Text>
        <Text className={styles.benefitName}>{benefit.name}</Text>
        <Text className={styles.benefitDesc}>{benefit.briefDescription}</Text>
        <View className={styles.tagRow}>
          <View className={classnames(styles.tag, styles.tagCategory)}>
            <Text className={styles.tagText}>
              {categoryMap[benefit.category]}
            </Text>
          </View>
          <View className={classnames(styles.tag, styles.tagStatus)}>
            <Text className={styles.tagText}>
              {statusMap[benefit.status]}
            </Text>
          </View>
        </View>
        <View className={styles.expiryInfo}>
          <Text className={styles.expiryText}>
            有效期至 {benefit.expiryDate}
          </Text>
        </View>
      </View>

      <View className={classnames(styles.detailSection, styles.canDoSection)}>
        <View className={styles.sectionLabel}>
          <Text className={styles.sectionLabelText}>✅ 能用来做什么</Text>
        </View>
        <Text className={styles.sectionContent}>{benefit.canDo}</Text>
      </View>

      <View className={classnames(styles.detailSection, styles.cannotDoSection)}>
        <View className={styles.sectionLabel}>
          <Text className={styles.sectionLabelText}>❌ 不能用来做什么</Text>
        </View>
        <Text className={styles.sectionContent}>{benefit.cannotDo}</Text>
      </View>

      <View className={classnames(styles.detailSection, styles.howToSaySection)}>
        <View className={styles.sectionLabel}>
          <Text className={styles.sectionLabelText}>💬 到店怎么说</Text>
        </View>
        <Text className={styles.howToSayContent}>{benefit.howToSay}</Text>
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.actionButton, styles.secondaryButton)}
          onClick={handleShareToFamily}
        >
          <Text className={classnames(styles.actionButtonText, styles.secondaryButtonText)}>
            分享给家属
          </Text>
        </View>
        <View
          className={classnames(
            styles.actionButton,
            inList ? styles.addedButton : styles.primaryButton
          )}
          onClick={handleAddToChecklist}
        >
          <Text
            className={classnames(
              styles.actionButtonText,
              inList ? styles.addedButtonText : styles.primaryButtonText
            )}
          >
            {inList ? '已加入清单' : '加入清单'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BenefitDetailPage;
