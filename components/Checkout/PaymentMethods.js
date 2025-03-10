/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useTranslation } from 'next-i18next';

import { paymentMethods } from '@/data/paymentMethods';
import styled from './styles.module.scss';

const PaymentMethods = ({
  paymentMethod,
  setPaymentMethod,
  setDisabled,
  setDbPM,
}) => {
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const saveHandler = async () => {
    try {
      const { data } = await axios.put('/api/user/changePM', { paymentMethod });
      setError(null);

      //Update để xác định trạng thái disabled cho button
      setDbPM(data.paymentMethod);
      setDisabled(true);
      toast.success('Change default payment method successfully!');
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  return (
    <div className={`${styled.payment} ${styled.card}`}>
      <h2 className={styled.heading}>{t('payment_method')} </h2>

      {paymentMethods.map((pm) => (
        <label
          htmlFor={pm.id}
          key={pm.id}
          className={styled.payment__item}
          onClick={() => setPaymentMethod(pm.id)}
          style={{
            backgroundColor: `${paymentMethod === pm.id ? '#f5f5f5' : ''}`,
            border: `${
              paymentMethod === pm.id ? '1px solid rgb(221, 221, 221)' : ''
            }`,
          }}
        >
          <input
            className={styled.payment__radio}
            type='radio'
            name='payment'
            id={pm.id}
            checked={paymentMethod === pm.id}
          />

          <div className={styled.payment__item_image}>
            <img src={`/images/checkout/${pm.id}.webp`} alt={pm.name} />
          </div>
          <div className={styled.payment__item_col}>
            <span>Оплатите с {pm.name}</span>
            <div className={styled.payment__item_creditImg}>
              {pm.images.length > 0
                ? pm.images.map((img, index) => (
                    <img
                      src={`/images/payment/${img}.webp`}
                      alt=''
                      key={index}
                    />
                  ))
                : pm.description}
              {pm.images.length > 0 && <p>and more...</p>}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default PaymentMethods;
