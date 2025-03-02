/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import * as Icon from 'react-feather';

import styled from '../../styles/Order.module.scss';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import Header from '@/components/Cart/Header';
import db from '@/utils/db';
// import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import StripePayment from '@/components/StripePayment';
import axios from 'axios';
import { useState } from 'react';
import NextImage from '@/components/NextImage';
import Link from 'next/link';
import { Product } from '@/models/Product';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


/* 
  The long cold start issue fix
  Relative issues: 
  #1 https://github.com/denvudd/react-dbmovies.github.io/issues/2
  #2 https://github.com/vercel/next.js/discussions/50783#discussioncomment-6139352
  #3 https://github.com/vercel/vercel/discussions/7961
  Documentation links:
  #1 https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props#getserversideprops-with-edge-api-routes
  !! Doesn't work in dev mode !!
*/
export const config = {
  runtime: 'experimental-edge', // warn: using an experimental edge runtime, the API might change
}

const OrderPage = ({ orderData, paypal_client_id, stripe_public_key }) => {
  const { t } = useTranslation();

  // const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [error, setError] = useState('');

  useEffect(() => {
    // if (orderData._id) {
    //   paypalDispatch({
    //     type: 'resetOptions',
    //     value: {
    //       'client-id': paypal_client_id,
    //       currency: 'USD',
    //     },
    //   });
    //   paypalDispatch({
    //     type: 'setLoadingStatus',
    //     value: 'pending',
    //   });
    // }
    console.log(orderData, 'orderdata');
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

  const price_monthh = orderData.products.map((product) =>
    (product.price * product.qty).toLocaleString('ru-RU')
  );

  console.log(orderData, 'orderdata');
  return (
    <>
      {/* <Header link='/' text={t('return_to_products')} /> */}
      <div className={styled.order}>
        <div className={styled.container}>
          <div className={`${styled.order__infos} ${styled.card}`}>
            <div className={styled.order__infos_heading}>
              <h1 className={styled.heading}>{t('view_order')}</h1>
              <h2>
                <span>Id:</span> {orderData._id}
              </h2>
            </div>
            <div className={styled.order__infos_status}>
              <span>
                <Icon.Info /> {t('header.status')}
              </span>
              {orderData.isPaid ? (
                <span>{t('paid')}</span>
              ) : (
                <span>{t('not_paid')}</span>
              )}
            </div>
            <div className={styled.order__infos_status}>
              <span>
                <Icon.Info />
                {t('header.status')}
              </span>
              <span>{orderData.status}</span>
            </div>
            <div className={styled.order__infos_status}>
              <span>
                <Icon.Info /> {t('order_details')}
              </span>
              <span>
                {t('qty')} {orderData.products.length}{' '}
                {/* {orderData?.products?.length > 1 ? 'продуктов' : 'продукт'} */}
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
                      {/* <p>{t('color')}: </p>
                      {product.color.image ? (
                        <img src={product.color.image} alt='' />
                      ) : (
                        <span
                          style={{ backgroundColor: product.color.color }}
                        ></span>
                      )} */}
                      <Icon.ChevronsRight /> <p>{t('size')} : </p>
                      {product.size} <Icon.ChevronsRight /> <p>{t('qty')} : </p>
                      {product.qty} <Icon.ChevronsRight />{' '}
                      <p>{t('price')} : </p>
                      {product.price_description.toLocaleString('ru-RU')}{' '}
                      <Icon.ChevronsRight />{' '}
                    </div>
                    <div className={styled.product__infos_total}>
                      <span>{t('header.cart_subtotal')}:</span>
                      <br />
                      <hr />
                      {(product.price * product.qty).toLocaleString(
                        'ru-RU'
                      )}{' '}
                      {t('price_month')}
                      <br />
                      <hr />
                      {(product.price_description * product.qty).toLocaleString(
                        'ru-RU'
                      )}
                      <hr />
                    </div>
                    <br />
                  </div>
                </div>
              ))}
              <div className={styled.order__total}>
                {orderData.totalBeforeDiscount > orderData.total ? (
                  <>
                    <div className={styled.order__total_sub}>
                      <span>{t('header.cart_subtotal')}</span>
                      <span>
                        {orderData.totalBeforeDiscount.toLocaleString('ru-RU')}{' '}
                      </span>
                    </div>

                    <div className={styled.order__total_sub}>
                      <span>{t('shipping_fee')}</span>
                      <span>
                        {orderData.shippingPrice.toLocaleString('ru-RU')} сум
                      </span>
                    </div>

                    {orderData.paymentMethod === 'cash' && (
                      <div className={styled.order__total_sub2}>
                        <span>{t('header.cart_subtotal')}</span>
                        <span></span>
                      </div>
                    )}

                    <div className={styled.order__total_sub2}>
                      <span>
                        {t('header.cart_subtotal')} {t('price_month')}
                      </span>
                      <span>
                        {orderData.total.toLocaleString('ru-RU')}
                        <br />
                      </span>
                      <hr />

                      <span>
                        {(orderData.total / 3).toLocaleString('ru-RU')}{' '}
                        {t('price_month')}{' '}
                      </span>
                      <br />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styled.order__total_sub}>
                      <span>{t('header.cart_subtotal')}</span>
                      <span>
                        {orderData.total.toLocaleString('ru-RU')}
                        <br />
                      </span>
                      <hr />

                      <span>
                        {(orderData.total / 3).toLocaleString('ru-RU')}{' '}
                        {t('price_month')}
                      </span>
                      <br />
                      {/* </span> */}
                    </div>
                  </>
                )}

                <div className={styled.order__total_sub}>
                  <span>{t('payment_method')}</span>
                  <span>
                    {orderData.paymentMethod === 'cash'
                      ? t('cash')
                      : 'Uzum Nasiya'}{' '}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styled.order__actions} ${styled.card}`}>
            <h2 className={styled.heading}>{t('customer')}</h2>
            <div className={styled.order__address}>
              <div className={styled.order__address_shipping}>
                <h3>{t('address')}</h3>
                <div className={styled.order__address_line}>
                  <span>{t('fist_name')} </span>
                  <span>
                    {orderData.shippingAddress.firstName}{' '}
                    {orderData.shippingAddress.lastName}
                  </span>
                </div>

                <div className={styled.order__address_line}>
                  <span>{t('address')} </span>
                  <span>{orderData.shippingAddress.address1}</span>
                </div>

                <div className={styled.order__address_line}>
                  <span>{t('state')} </span>
                  <span>
                    {orderData.shippingAddress.state},{' '}
                    {orderData.shippingAddress.city}
                  </span>
                </div>
              </div>

              {/* <div className={styled.order__address_shipping}>
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
              </div> */}
            </div>
            {!orderData.isPaid ? (
              <div className={styled.order__payment}>
                {/* {orderData.paymentMethod == 'paypal' && (
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
                )} */}

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
                <Icon.CheckCircle /> Оплата успешна!
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
  const { locale } = context;

  await db.connectDb();

  const orderData = await Order.findById(id)
    .populate({
      path: 'user',
      model: User,
      strictPopulate: false,
    })
    .lean();

  // let paypal_client_id = process.env.PAYPAL_CLIENT_ID;
  let stripe_public_key = process.env.STRIPE_PUBLIC_KEY;

  db.disConnectDb();

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      orderData: JSON.parse(JSON.stringify(orderData)),
      // paypal_client_id,
      stripe_public_key,
    },
  };
}
