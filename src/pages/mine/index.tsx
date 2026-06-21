import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { memberData } from '@/data/member';
import { benefitsData } from '@/data/benefits';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { largeTextMode, toggleLargeText, familyMembers, removeFamilyMember } = useAppStore();
  const expiringBenefits = benefitsData.filter((b) => b.status === 'expiring');

  const handleFamilyBind = () => {
    Taro.navigateTo({ url: '/pages/family-bind/index' });
  };

  const handleViewExpiring = () => {
    Taro.switchTab({ url: '/pages/benefits/index' });
  };

  const handleRemoveFamily = (e: any, id: string) => {
    e.stopPropagation();
    Taro.showModal({
      title: '确认解绑',
      content: '确定要解绑该家属吗？',
      success: (res) => {
        if (res.confirm) {
          removeFamilyMember(id);
          Taro.showToast({ title: '已解绑', icon: 'success' });
        }
      },
    });
  };

  return (
    <View className={classnames(styles.container, largeTextMode && styles.largeText)}>
      <View className={styles.profileCard}>
        <View className={styles.avatar}>
          <Text className={styles.avatarText}>{memberData.levelIcon}</Text>
        </View>
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{memberData.name}</Text>
          <Text className={styles.userLevel}>
            {memberData.level} · {memberData.points}积分
          </Text>
          <Text className={styles.userPhone}>{memberData.phone}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>👨‍👩‍👧 家属管理</Text>
        {familyMembers.length > 0 && (
          <View className={styles.familyCard}>
            {familyMembers.map((member) => (
              <View className={styles.familyItem} key={member.id}>
                <View className={styles.familyAvatar}>
                  <Text className={styles.familyAvatarText}>{member.avatar}</Text>
                </View>
                <View className={styles.familyInfo}>
                  <Text className={styles.familyName}>
                    {member.name}（{member.relationship}）
                  </Text>
                  <Text className={styles.familyRelation}>
                    绑定于 {member.boundDate}
                  </Text>
                </View>
                <Text className={styles.familyPhone}>{member.phone}</Text>
                <View className={styles.unbindButton} onClick={(e) => handleRemoveFamily(e, member.id)}>
                  <Text className={styles.unbindButtonText}>解绑</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        <View className={styles.addFamilyButton} onClick={handleFamilyBind}>
          <Text className={styles.addFamilyText}>+ 绑定家属</Text>
        </View>
      </View>

      {expiringBenefits.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>⏰ 即将过期权益</Text>
          <View className={styles.expiringCard} onClick={handleViewExpiring}>
            {expiringBenefits.map((benefit) => (
              <View className={styles.expiringItem} key={benefit.id}>
                <Text className={styles.expiringIcon}>{benefit.icon}</Text>
                <View className={styles.expiringInfo}>
                  <Text className={styles.expiringTitle}>{benefit.name}</Text>
                  <Text className={styles.expiringDate}>
                    有效期至 {benefit.expiryDate}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>⚙️ 设置</Text>
        <View className={styles.menuCard}>
          <View className={styles.menuItem}>
            <Text className={styles.menuIcon}>🔤</Text>
            <Text className={styles.menuLabel}>大字模式</Text>
            <View
              className={classnames(
                styles.toggleSwitch,
                largeTextMode && styles.toggleSwitchActive
              )}
              onClick={toggleLargeText}
            >
              <View className={styles.toggleKnob} />
            </View>
          </View>
          <View className={styles.menuItem} onClick={() => Taro.switchTab({ url: '/pages/benefits/index' })}>
            <Text className={styles.menuIcon}>📋</Text>
            <Text className={styles.menuLabel}>权益说明</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem}>
            <Text className={styles.menuIcon}>📞</Text>
            <Text className={styles.menuLabel}>客服电话</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem}>
            <Text className={styles.menuIcon}>📖</Text>
            <Text className={styles.menuLabel}>关于我们</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MinePage;
