import { Form, Formik } from 'formik';
import { useMemo, useState, useEffect } from 'react';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';
import { useTranslation } from 'next-i18next';

import styled from './styles.module.scss';
// import ShippingInput from '../Input/ShippingInput';
// import { applyCoupon } from '@/utils/request';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  calculateTotal,
  calculateTotalDescription,
  emptyCartHandler,
} from '@/utils/productUltils';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';

const Summary = ({
  totalAfterDiscount,
  setTotalAfterDiscount,
  user,
  cart,
  paymentMethod,
  selectedAddress,
}) => {
  // const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState('');
  const [error, setError] = useState('');
  const [orderError, setOrderError] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const Router = useRouter();

  // const validateCoupon = Yup.object({
  //   coupon: Yup.string().required('Please enter a coupon first (if any)'),
  // });

  // const shipping = useMemo(() => {
  //   return cart?.products?.reduce((a, c) => a + (c.shipping || 0), 0);
  // }, [cart.products]);

  // const applyCouponHandler = async () => {
  //   const res = await applyCoupon(coupon, user._id);
  //   if (res.message) {
  //     setError(res.message);
  //   } else {
  //     setTotalAfterDiscount(res.totalAfterDiscount);
  //     setDiscount(res.discount);
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Applied successfully!',
  //       text: "Let's place the order now with the cheapest price.",
  //       showConfirmButton: true,
  //     });
  //     setError('');
  //   }
  // };

  // const total = useMemo(() => {
  //   const totalAfterDiscountValue = totalAfterDiscount || 0;
  //   const cartTotalValue = cart.cartTotal || 0;
  //   const shippingValue = shipping || 0;
  //   return discount > 0
  //     ? totalAfterDiscountValue + shippingValue
  //     : cartTotalValue + shippingValue;
  // }, [discount, totalAfterDiscount, shipping, cart.cartTotal]);

  // console.log('Total:', total);

  console.log(cart);
  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      if (paymentMethod === '') {
        Swal.fire({
          icon: 'error',
          title: 'Failed...',
          text: 'Please choose a payment method!',
        });
        return;
      } else if (!selectedAddress) {
        Swal.fire({
          icon: 'error',
          title: 'Failed...',
          text: 'Please choose a shipping address!',
        });
        return;
      }

      const { data } = await axios.post('/api/order/create', {
        products: cart.cartItems.map((product) => product),
        shippingAddress: selectedAddress,
        // shippingPrice: shipping,
        paymentMethod,
        total: calculateTotalDescription(
          cart.cartItems.map((product) => product)
        ),

        // totalBeforeDiscount: cart.cartTotal,
        // couponApplied: coupon,
        // user_id: user._id,
      });

      // Order ID: ${newOrder._id

      // const message = `Новый заказ создан!\n\nПолное Имя: ${
      //   selectedAddress.firstName
      // } ${selectedAddress.lastName} \n\n Товары: ${cart.cartItems
      //   .map((product) => product)
      //   .map((product) => product.name)
      //   .join(', ')} \n\n Сумма: ${calculateTotal(
      //   cart.cartItems.map((product) => product)
      // )} \n\n Метод Оплаты: ${paymentMethod}\n\n Адресс: ${
      //   selectedAddress.address1
      // } Район:${selectedAddress.state} Город:${selectedAddress.city} Страна: ${
      //   selectedAddress.country
      // }\n\n  Почтовый Индекс: ${selectedAddress.zipCode} \n\n Номер:${
      //   selectedAddress.phoneNumber
      // } \n\n`;

      // const message = `🚀 *Новый заказ создан!*\n\n👤 *Полное Имя:* ${
      //   selectedAddress.firstName
      // } ${selectedAddress.lastName} \n\n📦 *Товары:* ${cart.cartItems
      //   .map((product) => product.name)
      //   .join(', ')} \n\n💰 *Сумма:* ${calculateTotal(
      //   cart.cartItems
      // )} \n\n💳 *Метод Оплаты:* ${paymentMethod}\n\n🏠 *Адрес:* ${
      //   selectedAddress.address1
      // } \n🏢 *Район:* ${selectedAddress.state} \n🌆 *Город:* ${
      //   selectedAddress.city
      // } \n🌍 *Страна:* ${selectedAddress.country}\n\n📮 *Почтовый Индекс:* ${
      //   selectedAddress.zipCode
      // } \n\n📞 *Номер:* ${selectedAddress.phoneNumber}\n\n`;

      const message = `🚀 <b>Новый заказ создан!</b>%0A👤 <b>Полное Имя:</b> ${
        selectedAddress.firstName
      } ${selectedAddress.lastName}%0A📦 <b>Товары:</b> ${cart.cartItems
        .map((product) => product.name)
        .join(', ')} <b>Количество:</b> (${cart.cartItems.map(
        (product) => product.qty
      )}) %0A💰 <b>Сумма:</b> ${calculateTotalDescription(
        cart.cartItems
      ).toLocaleString(
        'ru-RU'
      )}%0A💳 <b>Метод Оплаты:</b> ${paymentMethod}%0A🏠 <b>Адрес:</b> ${
        selectedAddress.address1
      } ${selectedAddress.address2}%0A🏢 <b>Район:</b> ${
        selectedAddress.state
      } %0A 🌆 <b>Город:</b> ${selectedAddress.city} %0A 🌍 <b>Страна:</b> ${
        selectedAddress.country
      } %0A %0A 📞 <b>Номер:</b> ${selectedAddress.phoneNumber} `;

      await axios.post('/api/telegram', {
        message: message,
      });

      // clear cart
      localStorage.removeItem('cart');
      emptyCartHandler(cart, dispatch);

      Router.push(`/order/${data.order_id}`);
    } catch (error) {
      console.log(error);

      setOrderError(error);
    }
  };

  return (
    <div className={`${styled.summary} ${styled.card}`}>
      <h2 className={styled.heading}></h2>
      {loading ? (
        <>
          <LoadingButton /> <p style={{ textAlign: 'center' }}>Loading...</p>
        </>
      ) : (
        <>
          <div className={styled.summary__infos_totalLine}>
            <span>{t('header.cart_subtotal')} : </span>
            {/* <span>
              {calculateTotal(
                cart.cartItems.map((product) => product)
              ).toLocaleString('ru-RU')}{' '}
              {t('price_month')}
            </span> */}
            <span>
              {calculateTotalDescription(
                cart.cartItems.map((product) => product)
              ).toLocaleString('ru-RU')}{' '}
              {t('price_def')}
            </span>
          </div>

          <div className={styled.summary__submit_btn}>
            <Button
              variant='contained'
              color='error'
              onClick={placeOrderHandler}
            >
              {t('buy_order')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Summary;
