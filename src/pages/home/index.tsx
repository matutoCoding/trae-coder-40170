import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { memberData, medicationReminders, paymentTips } from '@/data/member';
import { vouchersData, recommendationsData } from '@/data/recommendations';
import { benefitsData } from '@/data/benefits';
import MemberBadge from '@/components/MemberBadge';
import VoucherCard from '@/components/VoucherCard';
import styles from './index.module.scss';

const tipIconMap: Record<string, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  success: '✅',
};

const HomePage: React.FC = () => {
  const { largeTextMode, toggleLargeText, addChecklistItem, isInChecklist } = useAppStore();
  const expiringBenefits = benefitsData.filter((b) => b.status === 'expiring');

  const handleNavigateBenefits = () => {
    Taro.switchTab({ url: '/pages/benefits/index' });
  };

  const handleNavigateStores = () => {
    Taro.switchTab({ url: '/pages/visit/index' });
  };

  const handleNavigateRecommendations = () => {
    Taro.navigateTo({ url: '/pages/recommendations/index' });
  };

  const handleNavigateExpiring = () => {
    Taro.switchTab({ url: '/pages/benefits/index' });
  };

  const handleAddReminderToChecklist = (reminder: typeof medicationReminders[0]) => {
    if (isInChecklist('reminder', reminder.id)) return;
    addChecklistItem({
      name: `补货：${reminder.name}`,
      category: '慢病药补货',
      isCompleted: false,
      source: 'reminder',
      sourceId: reminder.id,
    });
    Taro.showToast({ title: '已加入到店清单', icon: 'success' });
  };

  const handleAddRecToChecklist = (rec: typeof recommendationsData[0]) => {
    if (isInChecklist('recommendation', rec.id)) return;
    addChecklistItem({
      name: rec.name,
      category: rec.category,
      isCompleted: false,
      source: 'recommendation',
      sourceId: rec.id,
    });
    Taro.showToast({ title: '已加入到店清单', icon: 'success' });
  };

  return (
    <View className={classnames(styles.container, largeTextMode && styles.largeText)}>
      <View className={styles.header}>
        <MemberBadge member={memberData} largeText={largeTextMode} />
        <View
          className={styles.largeTextButton}
          onClick={toggleLargeText}
        >
          <Text className={styles.largeTextButtonText}>
            {largeTextMode ? '标准字' : '大字模式'}
          </Text>
        </View>
      </View>

      {expiringBenefits.length > 0 && (
        <View className={styles.banner} onClick={handleNavigateExpiring}>
          <View className={styles.bannerLeft}>
            <Text className={styles.bannerIcon}>⏰</Text>
            <Text className={styles.bannerText}>
              您有{expiringBenefits.length}项权益即将过期，点击查看
            </Text>
          </View>
          <Text className={styles.bannerArrow}>›</Text>
        </View>
      )}

      <View className={styles.entrySection}>
        <View className={styles.entryCard} onClick={handleNavigateBenefits}>
          <Text className={styles.entryIcon}>🏥</Text>
          <Text className={styles.entryLabel}>我的权益</Text>
          <Text className={styles.entryDesc}>查看可用权益</Text>
        </View>
        <View className={styles.entryCard} onClick={handleNavigateStores}>
          <Text className={styles.entryIcon}>🏪</Text>
          <Text className={styles.entryLabel}>哪家店能用</Text>
          <Text className={styles.entryDesc}>附近药店</Text>
        </View>
        <View className={styles.entryCard} onClick={handleNavigateRecommendations}>
          <Text className={styles.entryIcon}>🛒</Text>
          <Text className={styles.entryLabel}>今天买什么</Text>
          <Text className={styles.entryDesc}>推荐好物</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>🎁 健康服务券</Text>
          <Text className={styles.sectionMore}>查看全部 ›</Text>
        </View>
        <ScrollView scrollX className={styles.voucherScroll}>
          <View className={styles.voucherScrollContent}>
            {vouchersData.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                largeText={largeTextMode}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>💊 复购提醒</Text>
        </View>
        {medicationReminders.map((reminder) => {
          const inList = isInChecklist('reminder', reminder.id);
          return (
            <View className={styles.reminderCard} key={reminder.id}>
              <Text className={styles.reminderIcon}>
                {reminder.isUrgent ? '🔴' : '💊'}
              </Text>
              <View className={styles.reminderInfo}>
                <Text className={styles.reminderName}>{reminder.name}</Text>
                <Text className={styles.reminderDosage}>{reminder.dosage}</Text>
              </View>
              <View className={styles.reminderRight}>
                <Text className={styles.reminderDate}>
                  建议复购 {reminder.nextPurchaseDate}
                </Text>
                {reminder.isUrgent && (
                  <View className={styles.urgentTag}>
                    <Text className={styles.urgentTagText}>需尽快</Text>
                  </View>
                )}
              </View>
              <View
                className={classnames(
                  styles.addToChecklistBtn,
                  inList && styles.addedBtn
                )}
                onClick={() => handleAddReminderToChecklist(reminder)}
              >
                <Text className={classnames(
                  styles.addToChecklistBtnText,
                  inList && styles.addedBtnText
                )}>
                  {inList ? '已加' : '+清单'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>🛒 今天推荐</Text>
          <Text className={styles.sectionMore} onClick={handleNavigateRecommendations}>
            查看全部 ›
          </Text>
        </View>
        <ScrollView scrollX className={styles.recScroll}>
          <View className={styles.recScrollContent}>
            {recommendationsData.slice(0, 5).map((rec) => {
              const inList = isInChecklist('recommendation', rec.id);
              return (
                <View className={styles.recCard} key={rec.id}>
                  <Text className={styles.recIcon}>{rec.icon}</Text>
                  <Text className={styles.recName}>{rec.name}</Text>
                  <Text className={styles.recReason}>{rec.reason}</Text>
                  <Text className={styles.recBenefit}>{rec.benefit}</Text>
                  <View
                    className={classnames(
                      styles.recAddBtn,
                      inList && styles.recAddedBtn
                    )}
                    onClick={() => handleAddRecToChecklist(rec)}
                  >
                    <Text className={classnames(
                      styles.recAddBtnText,
                      inList && styles.recAddedBtnText
                    )}>
                      {inList ? '已加' : '+清单'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📋 医保个账支付注意</Text>
        </View>
        {paymentTips.map((tip) => (
          <View className={styles.tipCard} key={tip.id}>
            <View className={classnames(styles.tipIconWrap, styles[tip.type])}>
              <Text className={styles.tipIcon}>{tipIconMap[tip.type]}</Text>
            </View>
            <View className={styles.tipContent}>
              <Text className={styles.tipTitle}>{tip.title}</Text>
              <Text className={styles.tipDesc}>{tip.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HomePage;
