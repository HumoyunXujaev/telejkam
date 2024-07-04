import React, { useState } from 'react';
import { useEffect } from 'react';
import { FcFullTrash } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';

import { updateCart } from '@/store/cartSlice';

import styled from './styles.module.scss';

const Top = ({ cartItems, selected, setSelected }) => {
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();

  const isSuperSmall = useMediaQuery({ query: '(max-width: 488px)' });

  const selectAllHandler = () => {
    if (!active) {
      setSelected(cartItems);
      setActive(true);
    } else {
      setSelected([]);
      setActive(false);
    }
  };

  const showPopupHandler = () => {
    if (selected?.length > 0) {
      Swal.fire({
        title: 'Вы Уверены?',
        text: `Выбранный вами ${
          selected?.length > 1 ? 'продукты' : 'продукт'
        } будет удален из корзины!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да, удалить!',
      }).then((result) => {
        if (result.isConfirmed) {
          removeProductsHandler();
          Swal.fire(
            'Удалено!',
            `Выбранный вами ${
              selected?.length > 1 ? 'продукт' : 'продукт'
            } был удален из корзины!`,
            'success'
          );
        }
      });
    } else {
      Swal.fire({
        title: 'Что вы хотите удалить?',
        text: 'Пожалуйста выберите хотя-бы 1 продукт!',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
    }
  };

  const removeProductsHandler = () => {
    const selected_Uids = selected?.map((s) => s._uniqueId);
    const newCart = cartItems.filter((item) => {
      return !selected_Uids.includes(item._uniqueId);
    });
    dispatch(updateCart(newCart));
    setSelected([]);
  };

  useEffect(() => {
    if (selected?.length < cartItems.length && active) {
      setActive(false);
    }

    if (selected?.length === cartItems.length) {
      setActive(true);
    }
    setSelected(cartItems);
    setActive(true);
  }, [selected, cartItems]);

  return (
    <div className={`${styled.cart__top} ${styled.card}`}>
      <span className={styled.cart__top_label}>
        <div
          className={`${styled.checkbox} ${active ? styled.active : ''}`}
          onClick={selectAllHandler}
        ></div>
        Все {!isSuperSmall && `(${cartItems.length} продукты)`}
      </span>
      <span className={styled.cart__top_label}>Цена за единицу товара</span>
      <span className={styled.cart__top_label}>Количество</span>
      <span className={styled.cart__top_label}>Цена</span>
      <span className={styled.cart__top_label} onClick={showPopupHandler}>
        <FcFullTrash />
      </span>
    </div>
  );
};

export default Top;
