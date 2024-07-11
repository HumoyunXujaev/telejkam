/* eslint-disable @next/next/no-img-element */
import { updateCart } from '@/store/cartSlice';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';
import * as Icon from 'react-feather';

import styled from './styles.module.scss';
import Link from 'next/link';
import NextImage from '../NextImage';
import { useTranslation } from 'next-i18next';

const Product = ({ product, selected, setSelected }) => {
  const { cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [active, setActive] = useState(null);

  const isSmall = useMediaQuery({ query: '(max-width: 684px)' });
  const isSuperSmall = useMediaQuery({ query: '(max-width: 488px)' });

  const updateQtyHandler = (type) => {
    let newCart = cart.cartItems.map((p) => {
      if (p._uniqueId === product._uniqueId) {
        return {
          ...p,
          qty: type === 'plus' ? p.qty + 1 : p.qty - 1,
        };
      }
      return p;
    });
    dispatch(updateCart(newCart));

    if (selected.length > 0) {
      setSelected(() => {
        const newSelected = [...selected];

        const itemIndex = newSelected.findIndex(
          (a) => a._uniqueId === product._uniqueId
        );

        const newItem = { ...newSelected[itemIndex] };

        if (type === 'plus') {
          newItem.qty = newItem.qty + 1;
        } else {
          newItem.qty = newItem.qty - 1;
        }

        newSelected[itemIndex] = newItem;

        return newSelected;
      });
    }
  };

  //Gỡ SP ra khỏi giỏ hàng
  const removeFromCartHandler = () => {
    let newCart = cart.cartItems.filter(
      (p) => p._uniqueId !== product._uniqueId
    );

    dispatch(updateCart(newCart));
  };

  useEffect(() => {
    const check = selected?.find((p) => {
      return p._uniqueId == product._uniqueId;
    });

    setActive(check);
  }, [selected]);

  const selectHandler = () => {
    if (active) {
      setSelected(selected?.filter((p) => p._uniqueId !== product._uniqueId));
    } else {
      setSelected([...selected, product]);
    }
  };

  const showPopupHandler = () => {
    Swal.fire({
      title: 'Вы уверены?',
      text: `Этот продукт будет удален из корзины!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да, удалить!',
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCartHandler();
        Swal.fire('Удалено!', 'Продукт был удален из корзины.', 'success');
      }
    });
  };

  return (
    <div className={styled.cart__product}>
      {/* Out of stock */}
      {product.quantity < 1 && <div className={styled.blur}></div>}
      <div className={styled.cart__product_header}>
        <div
          className={`${styled.checkbox} ${active ? styled.active : ''}`}
          onClick={selectHandler}
        ></div>
        <Link href={'/'}>
          <Icon.Home />
          Telejkam
          <Icon.ChevronRight />
        </Link>
      </div>
      <div className={styled.cart__product_body}>
        {/* Col 1 */}
        <div className={styled.infos}>
          <div
            className={`${styled.checkbox} ${active ? styled.active : ''}`}
            onClick={selectHandler}
          ></div>
          {!isSmall && (
            <Link
              target='_blank'
              href={`/product/${product.slug}?style=${product.style}&size=${product.sizeIndex}`}
              className={styled.image}
            >
              <NextImage src={product.images[0].url} />
            </Link>
          )}
          <div className={styled.detail}>
            <h3>{product.name}</h3>
            {product.size && (
              <p>
                <span>{t('size')}&nbsp;</span>
                {product.size}
              </p>
            )}
            <p>
              <span>{t('color')} :&nbsp;</span>
              {product?.color?.image ? (
                <img src={product?.color?.image} alt='' />
              ) : (
                <span
                  style={{
                    backgroundColor: product?.color?.color,
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                ></span>
              )}
            </p>
            {!isSuperSmall && (
              <p>
                <span>{t('shipping_fee')} :&nbsp;</span>
                {product.shipping ? `$${product.shipping}` : t('free_shipping')}
              </p>
            )}
            {!isSuperSmall && (
              <p>
                <span>{t('specifications')}:&nbsp;</span>
                <Link
                  target='_blank'
                  href={`/product/${product.slug}?style=${product.style}&size=${product.sizeIndex}`}
                >
                  Нажмите здесь <Icon.ChevronRight />
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Col 2 */}
        <div className={styled.price}>
          {product.discount > 0 && !isSmall && (
            <p className={styled.price__discount}>
              {t('discount')}:&nbsp;&nbsp;
              <span>-{product.discount}%</span>
            </p>
          )}

          <div className={styled.price__number}>
            {product.price && (
              <span>{product.price.toLocaleString('ru-RU')}</span>
            )}
            {product.price !== product.priceBefore && !isSmall && (
              <del>
                {product?.priceBefore?.toLocaleString('ru-RU')}{' '}
                {t('price_month')}
              </del>
            )}
          </div>
        </div>

        {/* Col 3 */}
        <div className={styled.quantity}>
          <button
            disabled={product.qty < 2}
            onClick={() => updateQtyHandler('minus')}
          >
            -
          </button>
          <span>{product.qty}</span>
          <button
            disabled={product.qty == product.quantity}
            onClick={() => updateQtyHandler('plus')}
          >
            +
          </button>
        </div>

        {/* Col 4 */}
        <span className={styled.amount}>
          {(product.price * product.qty).toLocaleString('ru-RU')}{' '}
          {t('price_month')}
        </span>

        {/* Col 5 */}
        <div className={styled.action}>
          {/* <div style={{ zIndex: 2 }}>
            <BsHeart />
          </div> */}
          <div
            className={styled.action__delete}
            style={{ zIndex: 2 }}
            onClick={showPopupHandler}
          >
            <Icon.Trash />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
