/* eslint-disable @next/next/no-img-element */
import React from 'react';

import styled from './styles.module.scss';
import { useTranslation } from 'next-i18next';

const PaymentMethods = () => {
  const { t } = useTranslation();

  return (
    <div className={`${styled.card} ${styled.cart__method}`}>
      <span className={styled.cart__method_header}>{t('payment_method')}</span>
      <div className={styled.cart__method_images}>
        <img src='/images/payment/uzum_nasiya.webp' alt='' />
        <img src='/images/payment/mastercard.webp' alt='' />
        <img src='/images/payment/visa.webp' alt='' />
      </div>
      <div className={styled.cart__method_protection}>{t('return_money')}</div>
    </div>
  );
};

export default PaymentMethods;
