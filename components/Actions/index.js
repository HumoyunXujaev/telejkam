import React from 'react';
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import * as Icon from 'react-feather';
import styled from './styles.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import { addToCartHandler } from '@/utils/productUltils';

export default function Actions({ product, productStyle, productSize }) {
  const { data: session } = useSession();
  const { cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const addToWishListHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlist.find((item) => item._id === product._id)) {
      return toast.error('Этот продукт уже в избранном!');
    }
    localStorage.setItem('wishlist', JSON.stringify([...wishlist, product]));
    toast.success('Добавлено в избранное');
  };

  return (
    <div className={styled.actions}>
      <Tooltip title={<p>Быстрый просмотр</p>} placement='left' arrow>
        <button className={styled.actions__quickview}>
          <Icon.Search />{' '}
        </button>
      </Tooltip>

      <Tooltip title={<p>Добавить в корзину</p>} placement='left' arrow>
        <button
          className={styled.actions__addToCart}
          onClick={(e) =>
            addToCartHandler(
              e,
              product._id,
              productStyle,
              productSize,
              cart,
              dispatch
            )
          }
        >
          <Icon.ShoppingCart />
        </button>
      </Tooltip>

      <Tooltip title={<p>Добавить в Избранное</p>} placement='left' arrow>
        <button
          className={styled.actions__wishlist}
          onClick={addToWishListHandler}
        >
          <Icon.Heart />
        </button>
      </Tooltip>
    </div>
  );
}
