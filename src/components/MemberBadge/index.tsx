import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { Member } from '@/types/benefit';
import styles from './index.module.scss';

interface MemberBadgeProps {
  member: Member;
  largeText?: boolean;
}

const MemberBadge: React.FC<MemberBadgeProps> = ({ member, largeText }) => {
  return (
    <View className={classnames(styles.badge, largeText && styles.largeText)}>
      <View className={styles.avatar}>
        <Text className={styles.avatarText}>{member.levelIcon}</Text>
      </View>
      <View className={styles.info}>
        <Text className={styles.name}>{member.name}</Text>
        <View className={styles.levelRow}>
          <View className={styles.levelTag}>
            <Text className={styles.levelText}>{member.level}</Text>
          </View>
          <Text className={styles.points}>{member.points}积分</Text>
        </View>
      </View>
    </View>
  );
};

export default MemberBadge;
