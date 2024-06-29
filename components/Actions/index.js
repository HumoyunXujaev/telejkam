import React from 'react';
import { FcSearch, FcLike, FcPaid } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

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

  // const addToWishListHandler = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   if (!session) {
  //     toast.error("Please login before using this feature!");
  //     return;
  //   }

  //   try {
  //     const { data } = await axios.put("/api/user/wishlist", {
  //       product_id: product._id,
  //       style: productStyle,
  //       size: productSize,
  //     });
  //     toast.success(data.message);
  //   } catch (error) {
  //     return toast.error(error.response.data.message);
  //   }
  // };

  return (
    <div className={styled.actions}>
      <Tooltip title={<p>Быстрый просмотр</p>} placement='left' arrow>
        <button className={styled.actions__quickview}>
          <FcSearch />
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
          <FcPaid />
        </button>
      </Tooltip>

      <Tooltip title={<p>Добавить в Избранное</p>} placement='left' arrow>
        <button
          className={styled.actions__wishlist}
          onClick={addToWishListHandler}
        >
          <FcLike />
        </button>
      </Tooltip>
    </div>
  );
}
