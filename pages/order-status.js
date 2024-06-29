// page that redirects the user to the spesific order page based on the order id that the user entered

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import styled from '@/styles/Browse.module.scss';
import BreadCrumb from '@/components/BreadCrumb';
import AnimateWrapper from '@/components/AnimateWrapper';
import { FaBox } from 'react-icons/fa';
import { RiSearch2Line } from 'react-icons/ri';

const OrderStatus = () => {
  const [orderId, setOrderId] = useState('');
  const router = useRouter();

  const submitHandler = async () => {
    router.push(`/order/${orderId}`);
  };

  return (
    <div className={styled.browse}>
      <Header />
      <div className={styled.browse__container}>
        <AnimateWrapper>
          <div className={styled.browse__path}>
            <BreadCrumb
              category={'Order Status'}
              categoryLink='/order-status'
              subCategories={[]}
            />
          </div>
          <div
            style={{
              alignContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div>
              <div
                style={{
                  backgroundColor: 'blue',
                  borderRadius: '15px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '60px',
                  height: '60px',
                  margin: 'auto',
                }}
              >
                <FaBox style={{ color: 'white', fontSize: '30px' }} />
              </div>
              <h1 style={{ textAlign: 'center' }}>Статус Заказа</h1>
              <p
                style={{
                  textAlign: 'center',
                  color: 'gray',
                  fontWeight: 'lighter',
                  padding: '1rem',
                }}
              >
                Чтобы увидеть ваш заказ, пожалуйста, заполните необходимые поля.
                <br />
                Номер заказа был отправлен на ваш номер в виде смс-сообщения
              </p>
              <form
                onSubmit={submitHandler}
                style={{
                  display: 'flex',
                  position: 'relative',
                  alignItems: 'center',
                  flex: 1,
                  backgroundColor: '#eeeeeebc',
                  height: '40px',
                  borderRadius: '3px',
                  zIndex: 96,
                }}
              >
                <input
                  type='text'
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder='Введите номер заказа'
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent',
                    paddingLeft: '1rem',
                  }}
                />
                <button
                  type='submit'
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: 'blue',
                    borderTopRightRadius: '5px',
                    borderBottomRightRadius: '5px',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <RiSearch2Line
                    style={{ width: '21px', height: '21px', fill: '#fff' }}
                  />
                </button>
              </form>
            </div>
          </div>
        </AnimateWrapper>
      </div>
    </div>
  );
};

export default OrderStatus;
