/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react';
import { BiChevronsRight } from 'react-icons/bi';
import { FcInfo, FcPaid } from 'react-icons/fc';
import Swal from 'sweetalert2';

import styled from '../../styles/Order.module.scss';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import Header from '@/components/Cart/Header';
import db from '@/utils/db';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import StripePayment from '@/components/StripePayment';
import axios from 'axios';
import { useState } from 'react';
import NextImage from '@/components/NextImage';
import Link from 'next/link';
import { Product } from '@/models/Product';

const OrderPage = ({ orderData, paypal_client_id, stripe_public_key }) => {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderData._id) {
      paypalDispatch({
        type: 'resetOptions',
        value: {
          'client-id': paypal_client_id,
          currency: 'USD',
        },
      });
      paypalDispatch({
        type: 'setLoadingStatus',
        value: 'pending',
      });
    }
  }, [OrderPage]);

  const createOrderHandler = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: orderData.total } }],
      })
      .then((order_id) => order_id);
  };

  const onApproveHandler = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        const { data } = await axios.put(`/api/order/${orderData._id}/pay`, {
          details,
          order_id: orderData._id,
        });

        Swal.fire({
          icon: 'success',
          title: 'Successfully!',
          text: "We'll deliver the package to you as soon as possible.",
          confirmButtonText: 'Ok',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            window.location.reload(false);
          }
        });
      } catch (error) {
        setError(error.message);
      }
    });
  };
  const onErrorHandler = (error) => {
    console.log(error);
  };

  console.log(orderData);
  return (
    <>
      <Header link='/' text='Вернуться на Главную' />
      <div className={styled.order}>
        <div className={styled.container}>
          <div className={`${styled.order__infos} ${styled.card}`}>
            <div className={styled.order__infos_heading}>
              <h1 className={styled.heading}>Просмотрите свой Заказ</h1>
              <h2>
                <span>Id Заказа:</span> {orderData._id}
              </h2>
            </div>
            <div className={styled.order__infos_status}>
              <span>
                <FcInfo /> Статут Оплаты :
              </span>
              {orderData.isPaid ? (
                <span>Оплачено</span>
              ) : (
                <span>Еще Не Оплачено</span>
              )}
            </div>
            <div className={styled.order__infos_status}>
              <span>
                <FcInfo />
                Статус Заказа :
              </span>
              <span>{orderData.status}</span>
            </div>
            <div className={styled.order__infos_status}>
              <span>
                <FcInfo /> Детали Заказа :
              </span>
              <span>
                Включает {orderData.products.length}{' '}
                {orderData?.products?.length > 1 ? 'продуктов' : 'продукт'}
              </span>
            </div>
            <div className={styled.order__products}>
              {orderData.products.map((product) => (
                <div key={product._id} className={styled.product}>
                  {/* <div className={styled.product__img}>
                    <NextImage src={product?.images?.url} alt={product.name} />
                  </div> */}
                  <div className={styled.product__infos}>
                    <h3 className={styled.product__infos_name}>
                      {product.name}
                    </h3>

                    <div className={styled.product__infos_row}>
                      <p>Цвет : </p>
                      {product.color.image ? (
                        <img src={product.color.image} alt='' />
                      ) : (
                        <span
                          style={{ backgroundColor: product.color.color }}
                        ></span>
                      )}
                      <BiChevronsRight /> <p>Размер : </p>
                      {product.size} <BiChevronsRight /> <p>Количество : </p>
                      {product.qty} <BiChevronsRight /> <p>Цена : </p>
                      {product.price}сум/мес <BiChevronsRight />{' '}
                    </div>
                    <div className={styled.product__infos_total}>
                      <span>Сумма :</span>
                      {(product.price * product.qty).toFixed(2)}сум
                    </div>
                  </div>
                </div>
              ))}
              <div className={styled.order__total}>
                {orderData.couponApplied &&
                orderData.totalBeforeDiscount > orderData.total ? (
                  <>
                    <div className={styled.order__total_sub}>
                      <span>Сумма</span>
                      <span>{orderData.totalBeforeDiscount} сум</span>
                    </div>

                    <div className={styled.order__total_sub}>
                      <span>Доставка</span>
                      <span>{orderData.shippingPrice.toFixed(2)} сум</span>
                    </div>
                    {/* <div className={styled.order__total_sub}>
                      <span>Tax price</span>
                      <span>${orderData.taxPrice.toFixed(2)}</span>
                    </div> */}
                    <div className={styled.order__total_sub2}>
                      <span>Общая сумма для оплаты</span>
                      <span>{orderData.total} сум</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* <div className={styled.order__total_sub}>
                      <span>Tax price</span>
                      <span>{orderData.taxPrice}</span>
                    </div> */}
                    <div className={styled.order__total_sub}>
                      <span>Общая сумма для оплаты</span>
                      <span>{orderData.total} сум</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={`${styled.order__actions} ${styled.card}`}>
            <h2 className={styled.heading}>Покупатель</h2>
            <div className={styled.order__address}>
              {/* <div className={styled.order__address_userInfos}>
                <div className={styled.order__address_userImage}>
                  <NextImage src={orderData.user.image} />
                </div>
                <div className={styled.order__address_userName}>
                  <span>{orderData.user.name}</span>
                  <span>{orderData.user.email}</span>
                </div>
              </div> */}
              <div className={styled.order__address_shipping}>
                <h3>Адресс Доставки</h3>
                <div className={styled.order__address_line}>
                  <span>Полное Имя : </span>
                  <span>
                    {orderData.shippingAddress.firstName}{' '}
                    {orderData.shippingAddress.lastName}
                  </span>
                </div>

                <div className={styled.order__address_line}>
                  <span>Адресс : </span>
                  <span>{orderData.shippingAddress.address1}</span>
                </div>

                <div className={styled.order__address_line}>
                  <span>Штат/Город : </span>
                  <span>
                    {orderData.shippingAddress.state},{' '}
                    {orderData.shippingAddress.city}
                  </span>
                </div>

                <div className={styled.order__address_line}>
                  <span>Почтовый Индекс : </span>
                  <span>{orderData.shippingAddress.zipCode}</span>
                </div>
              </div>

              <div className={styled.order__address_shipping}>
                <h3>Адресс доставки</h3>
                <div className={styled.order__address_line}>
                  <span>Полное Имя : </span>
                  <span>
                    {orderData.shippingAddress.firstName}{' '}
                    {orderData.shippingAddress.lastName}
                  </span>
                </div>

                <div className={styled.order__address_line}>
                  <span>Адресс : </span>
                  <span>{orderData.shippingAddress.address1}</span>
                </div>

                <div className={styled.order__address_line}>
                  <span>Штат/Город : </span>
                  <span>
                    {orderData.shippingAddress.state},{' '}
                    {orderData.shippingAddress.city}
                  </span>
                </div>

                <div className={styled.order__address_line}>
                  <span>Почтовый Индекс : </span>
                  <span>{orderData.shippingAddress.zipCode}</span>
                </div>
              </div>
            </div>
            {!orderData.isPaid ? (
              <div className={styled.order__payment}>
                {orderData.paymentMethod == 'paypal' && (
                  <div>
                    {isPending ? (
                      <span>loading....</span>
                    ) : (
                      <PayPalButtons
                        createOrder={createOrderHandler}
                        onApprove={onApproveHandler}
                        onError={onErrorHandler}
                      ></PayPalButtons>
                    )}
                  </div>
                )}

                {orderData.paymentMethod == 'credit_card' && (
                  <StripePayment
                    total={orderData.total}
                    order_id={orderData._id}
                    stripe_public_key={stripe_public_key}
                  />
                )}
              </div>
            ) : (
              <div className={styled.paid}>
                <FcPaid /> Оплата успешна!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;

export async function getServerSideProps(context) {
  const { id } = context.query;

  await db.connectDb();

  const orderData = await Order.findById(id)
    .populate({
      path: 'user',
      model: User,
      strictPopulate: false,
    })
    .lean();

  let paypal_client_id = process.env.PAYPAL_CLIENT_ID;
  let stripe_public_key = process.env.STRIPE_PUBLIC_KEY;

  db.disConnectDb();

  return {
    props: {
      orderData: JSON.parse(JSON.stringify(orderData)),
      paypal_client_id,
      stripe_public_key,
    },
  };
}
