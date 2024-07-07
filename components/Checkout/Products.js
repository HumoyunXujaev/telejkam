/* eslint-disable @next/next/no-img-element */
import { VscDebugBreakpointFunction } from 'react-icons/vsc';
import { BsArrowReturnRight } from 'react-icons/bs';

import styled from './styles.module.scss';
import NextImage from '../NextImage';
import { calculateTotal } from '@/utils/productUltils';

const Products = ({ cart }) => {
  return (
    <div className={`${styled.products} ${styled.card}`}>
      <div className={styled.products__header}>
        <h2 className={styled.heading}>
          Корзина{' '}
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
                  <p>
                    <VscDebugBreakpointFunction />
                    <span>Цвет : </span>{' '}
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
                  </p>
                  <p>
                    <VscDebugBreakpointFunction />
                    <span>Размер : </span>
                    {product.size}
                  </p>
                  <p>
                    <VscDebugBreakpointFunction />

                    <span>Количество : </span>
                    {product.qty}
                  </p>
                  <p>
                    <VscDebugBreakpointFunction />
                    <span>Цена : </span>
                    {product.price}сум/мес/штука
                  </p>
                  <div className={styled.product__total}>
                    <BsArrowReturnRight />{' '}
                    <p>
                      {(product?.price * product?.qty)?.toLocaleString('ru-RU')}{' '}
                      сум/мес
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styled.products__subTotal}>
        Сумма : <span>{calculateTotal(cart.cartItems)} сум/мес</span>
        <span>(Эта цена не включает доставку)</span>
      </div>
    </div>
  );
};

export default Products;
