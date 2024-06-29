/* eslint-disable @next/next/no-img-element */
import React from 'react';

import styled from './styles.module.scss';

const PaymentMethods = () => {
  return (
    <div className={`${styled.card} ${styled.cart__method}`}>
      <span className={styled.cart__method_header}>Payment methods</span>
      <div className={styled.cart__method_images}>
        <img src='/images/payment/visa.webp' alt='' />
        <img src='/images/payment/mastercard.webp' alt='' />
        <img src='/images/payment/paypal.webp' alt='' />
      </div>
      <div className={styled.cart__method_protection}>
        * Полный возврат денег если продукт не такой как описан или не
        доставлен.
      </div>
    </div>
  );
};

export default PaymentMethods;
