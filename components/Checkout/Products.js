/* eslint-disable @next/next/no-img-element */
import * as Icon from 'react-feather';

import styled from './styles.module.scss';
import NextImage from '../NextImage';
import {
  calculateTotal,
  calculateTotalDescription,
} from '@/utils/productUltils';
import { useTranslation } from 'next-i18next';

const Products = ({ cart }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styled.products} ${styled.card}`}>
      <div className={styled.products__header}>
        <h2 className={styled.heading}>
          {t('header.cart')}
          <span>
            (
            {`${cart?.cartItems.length} ${
              cart?.cartItems?.length > 1 ? 'продуктов' : 'продукт'
            }`}
            )
          </span>
        </h2>
      </div>
      <div className={styled.products__wrap}>
        {cart?.cartItems?.map((product, index) => {
          return (
            <div className={styled.product} key={index}>
              <div className={styled.product__image}>
                <NextImage src={product.images[0].url} />
              </div>
              <div className={styled.product__infos_wrapper}>
                <h3>{product.name}</h3>
                <div className={styled.product__infos}>
                  {/* <p>
                    <span>{t('color')} : </span>{' '}
                    {product.color.image ? (
                      <img src={product.color.image} alt='' />
                    ) : (
                      <span
                        style={{
                          background: product.color.color,
                          width: '15px',
                          height: '15px',
                          borderRadius: '50%',
                          display: 'inline-block',
                        }}
                      ></span>
                    )}
                  </p> */}
                  <p>
                    <span>{t('size')} : </span>
                    {product.size}
                  </p>
                  <p>
                    <span>{t('qty')} : </span>
                    {product.qty}
                  </p>
                  <p>
                    <span>{t('price')} : </span>
                    {product.price.toLocaleString('ru-RU')} {t('price_month')}
                  </p>
                  <p>
                    <span> </span>
                    {product.price_description.toLocaleString('ru-RU')}{' '}
                    {t('price_def')}
                  </p>
                  <div className={styled.product__total}>
                    <Icon.CornerDownRight />{' '}
                    {/* <p>
                      {(product?.price * product?.qty)?.toLocaleString('ru-RU')}{' '}
                      {t('price_month')}
                    </p> */}
                    <br />
                    <p>
                      {(
                        product?.price_description * product?.qty
                      )?.toLocaleString('ru-RU')}{' '}
                      {t('price_def')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styled.products__subTotal}>
        {t('header.cart_subtotal')} :{' '}
        <span>
          {/* {calculateTotal(cart.cartItems)} {t('price_month')} <></> */}
          {calculateTotalDescription(cart.cartItems)} {t('price_def')}
        </span>
      </div>
    </div>
  );
};

export default Products;
