import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import type { FamilyMember } from '@/types/benefit';
import styles from './index.module.scss';

const relations = ['儿子', '女儿', '配偶', '其他'];

const relationAvatarMap: Record<string, string> = {
  '儿子': '👨',
  '女儿': '👩',
  '配偶': '💑',
  '其他': '🧑',
};

const FamilyBindPage: React.FC = () => {
  const { largeTextMode, addFamilyMember } = useAppStore();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');

  const handleSubmit = () => {
    if (!phone.trim()) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    if (!name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!relation) {
      Taro.showToast({ title: '请选择关系', icon: 'none' });
      return;
    }
    if (!/^1\d{10}$/.test(phone.trim())) {
      Taro.showToast({ title: '手机号格式不正确，请输入11位手机号', icon: 'none' });
      return;
    }

    const newMember: FamilyMember = {
      id: `fm_${Date.now()}`,
      name: name.trim(),
      relationship: relation,
      phone: phone.trim(),
      avatar: relationAvatarMap[relation] || '🧑',
      boundDate: new Date().toISOString().slice(0, 10),
    };

    const success = addFamilyMember(newMember);
    if (!success) {
      Taro.showToast({ title: '该手机号已绑定，请勿重复绑定', icon: 'none' });
      return;
    }

    console.info('[FamilyBind] 绑定家属成功:', newMember);
    Taro.showToast({ title: '绑定成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={classnames(styles.container, largeTextMode && styles.largeText)}>
      <View className={styles.headerSection}>
        <Text className={styles.headerIcon}>👨‍👩‍👧</Text>
        <Text className={styles.headerTitle}>绑定家属</Text>
        <Text className={styles.headerDesc}>
          绑定老人手机号后，家属可以代为查看权益、接收过期提醒、生成到店清单
        </Text>
      </View>

      <View className={styles.formSection}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            老人手机号<Text className={styles.formRequired}>*</Text>
          </Text>
          <Input
            className={styles.formInput}
            type="number"
            maxlength={11}
            placeholder="请输入老人手机号"
            placeholderClass={styles.formInputPlaceholder}
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            家属姓名<Text className={styles.formRequired}>*</Text>
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入您的姓名"
            placeholderClass={styles.formInputPlaceholder}
            value={name}
            onInput={(e) => setName(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            与老人关系<Text className={styles.formRequired}>*</Text>
          </Text>
          <View className={styles.relationRow}>
            {relations.map((rel) => (
              <View
                key={rel}
                className={classnames(
                  styles.relationTag,
                  relation === rel && styles.relationTagActive
                )}
                onClick={() => setRelation(rel)}
              >
                <Text className={styles.relationTagText}>{rel}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.tipsSection}>
        <Text className={styles.tipsTitle}>绑定说明</Text>
        <View className={styles.tipItem}>
          <View className={styles.stepNumber}>
            <Text className={styles.stepNumberText}>1</Text>
          </View>
          <View className={styles.stepInfo}>
            <Text className={styles.stepTitle}>输入老人手机号</Text>
            <Text className={styles.stepDesc}>
              填写老人在药店注册时使用的手机号
            </Text>
          </View>
        </View>
        <View className={styles.tipItem}>
          <View className={styles.stepNumber}>
            <Text className={styles.stepNumberText}>2</Text>
          </View>
          <View className={styles.stepInfo}>
            <Text className={styles.stepTitle}>老人确认授权</Text>
            <Text className={styles.stepDesc}>
              系统会发送短信验证码到老人手机，确认授权后即可绑定
            </Text>
          </View>
        </View>
        <View className={styles.tipItem}>
          <View className={styles.stepNumber}>
            <Text className={styles.stepNumberText}>3</Text>
          </View>
          <View className={styles.stepInfo}>
            <Text className={styles.stepTitle}>开始管理权益</Text>
            <Text className={styles.stepDesc}>
              绑定成功后，家属可代为查看权益、接收提醒、生成到店清单
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.submitButton} onClick={handleSubmit}>
          <Text className={styles.submitButtonText}>确认绑定</Text>
        </View>
        <Text className={styles.tipText}>
          绑定后老人会收到短信通知，可随时取消授权
        </Text>
      </View>
    </View>
  );
};

export default FamilyBindPage;
