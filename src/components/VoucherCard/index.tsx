import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import type { Voucher } from '@/types/benefit';
import styles from './index.module.scss';

interface VoucherCardProps {
  voucher: Voucher;
  largeText?: boolean;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, largeText }) => {
  const handleClaim = () => {
    if (voucher.status !== 'claimable') return;
    Taro.showToast({
      title: '领取成功',
      icon: 'success',
    });
    console.info('[VoucherCard] 领取优惠券:', voucher.id);
  };

  return (
    <View
      className={classnames(
        styles.card,
        largeText && styles.largeText,
        voucher.status === 'claimed' && styles.claimed,
        voucher.status === 'expired' && styles.expired
      )}
    >
      <View className={styles.leftSection}>
        <Text className={styles.icon}>{voucher.icon}</Text>
        <Text className={styles.value}>{voucher.value}</Text>
      </View>
      <View className={styles.rightSection}>
        <Text className={styles.name}>{voucher.name}</Text>
        <Text className={styles.description}>{voucher.description}</Text>
        <Text className={styles.expiry}>有效期至 {voucher.expiryDate}</Text>
      </View>
      {voucher.status === 'claimable' && (
        <View className={styles.claimButton} onClick={handleClaim}>
          <Text className={styles.claimButtonText}>领取</Text>
        </View>
      )}
      {voucher.status === 'claimed' && (
        <View className={styles.claimedTag}>
          <Text className={styles.claimedTagText}>已领</Text>
        </View>
      )}
    </View>
  );
};

export default VoucherCard;
