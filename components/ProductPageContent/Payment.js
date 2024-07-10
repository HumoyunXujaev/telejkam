/* eslint-disable @next/next/no-img-element */
import React from 'react';

import styled from './styles.module.scss';
import NextImage from '../NextImage';

const Payment = () => {
  return (
    <div className={styled.payment}>
      <span>Payment Method</span>
      <div className={styled.payment__images}>
        <div className={styled.payment__image_wrap}>
          <div
            style={{
              width: 65,
              height: 40,
              position: 'relative',
            }}
          >
            <NextImage src='/images/payment/cash.jpg' alt='Visa' />
          </div>
        </div>
        <div className={styled.payment__image_wrap}>
          <div
            style={{
              width: 65,
              height: 40,
              position: 'relative',
            }}
          >
            <NextImage
              src='/images/payment/uzum_nasiya.webp'
              alt='Mastercard'
            />
          </div>
        </div>
        <div className={styled.payment__image_wrap}>
          <div
            style={{
              width: 65,
              height: 40,
              position: 'relative',
            }}
          >
            <NextImage src='/images/payment/uzcard.jpg' alt='Paypal' />
          </div>
        </div>
        <div className={styled.payment__image_wrap}>
          <div
            style={{
              width: 65,
              height: 40,
              position: 'relative',
            }}
          >
            <NextImage src='/images/payment/humo.jpg' alt='Paypal' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
