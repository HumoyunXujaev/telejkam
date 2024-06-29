import Link from 'next/link';
import { RiSearch2Line } from 'react-icons/ri';
import { FaBox, FaBoxOpen, FaHeart, FaOpencart, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import NextImage from '../NextImage';

import styled from './styles.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import HeaderCartItem from './HeaderCartItem';
import {
  calculateSubPrice,
  calculateTotal,
  calculateTotalShipping,
} from '@/utils/productUltils';
import { Button, Tooltip } from '@mui/material';
import SearchResults from './SearchResults/';
import axios from 'axios';
import { BiLoader } from 'react-icons/bi';
import { signIn, useSession } from 'next-auth/react';
import { MdDashboard } from 'react-icons/md';
const Main = ({ searchHandler2 }) => {
  const { data: session } = useSession();

  const { cart } = useSelector((state) => ({ ...state }));
  const router = useRouter();
  const [query, setQuery] = useState(router.query.search || '');
  const [products, setProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const timerId = setTimeout(async () => {
      if (query.length > 0) {
        setLoading(true);
        const { data } = await axios(`/api/search?query=${query}`);
        setProducts(data);
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  const searchHandler = (e) => {
    e.preventDefault();

    if (router.pathname == '/browse') {
      //Value của input tại Browse page cho phép bằng rỗng
      searchHandler2(query);
    } else {
      //Đối với các trang ngoài /Browse
      //Sau khi submit search form, chuyển hướng người dùng về Browse page
      //Value của input phải khác rỗng, nếu bằng rỗng thi return
      if (query && query.trim().length > 0) {
        router.push(`/browse?search=${query}`);
      } else {
        return toast.error('Invalid search query!');
      }
    }
  };

  return (
    <div className={styled.main}>
      <div className={styled.main__container}>
        {/* logo */}
        <Link href='/'>
          <div className={styled.logo}>
            <NextImage src='/telejkam.png' alt='Logo Telejkam' />
          </div>
        </Link>

        <Link href='browse'>
          <div className={styled.browse}>
            <MdDashboard size={20} />
            <span>Каталог</span>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={searchHandler} className={styled.search}>
          <input
            type='text'
            placeholder='Искать товары...'
            onChange={searchChangeHandler}
            value={query}
            onBlur={() => setShowSearchResults(false)}
            onFocus={() => setShowSearchResults(true)}
          />
          <SearchResults
            products={products}
            showSearchResults={showSearchResults}
            query={query}
            loading={loading}
          />
          <button type='submit' className={styled.search__icon}>
            {loading && (
              <span>
                <BiLoader />
              </span>
            )}
            {!loading && <RiSearch2Line />}
          </button>
        </form>
        <Link href={`order-status`}>
          <div className={styled.orderStatus}>
            <FaBox />
            <span className={styled.orderStatus__text}>Статус заказа</span>
            <div className={styled.cart__dropdown}>
              <div className={styled.cart__empty}>
                <div className={styled.cart__empty_img}>
                  <NextImage src='/images/empty-order-5.webp' />
                </div>
                <p>Проверьте статус вашего заказа</p>
                <div className={styled.cart__empty_btn}>
                  <Button
                    variant='contained'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push('/browse');
                    }}
                  >
                    Просто введите номер заказа
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Cart */}
        <Link href='cart'>
          <div className={styled.cart}>
            <FaOpencart />
            <span className={styled.cart__number}>{cart.cartItems.length}</span>
            <span className={styled.cart__text}>Корзина</span>

            <div className={styled.cart__dropdown}>
              {cart.cartItems.length > 0 ? (
                <div>
                  <div className={styled.cart__items}>
                    {cart.cartItems.map((item) => (
                      <HeaderCartItem key={item._uniqueId} item={item} />
                    ))}
                  </div>
                  <div className={styled.cart__priceComponent}>
                    <p>
                      <span>Subtotal :</span>
                      <span>${calculateSubPrice(cart.cartItems)}</span>
                    </p>
                    <p>
                      <span>Shipping :</span>
                      <span>${calculateTotalShipping(cart.cartItems)}</span>
                    </p>
                  </div>
                  <div className={styled.cart__total}>
                    <span>Total :</span>
                    <span>{calculateTotal(cart.cartItems)}$</span>
                  </div>
                  <div className={styled.cart__seeAll}>
                    See all items in cart
                  </div>
                </div>
              ) : (
                <div className={styled.cart__empty}>
                  <div className={styled.cart__empty_img}>
                    <NextImage src='/images/empty.png' />
                  </div>
                  <p>Cart is empty!</p>
                  <div className={styled.cart__empty_btn}>
                    <Button
                      variant='contained'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push('/browse');
                      }}
                    >
                      SHOP NOW
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
        <Link href={`wishlist`}>
          <div className={styled.wishlist}>
            <FaHeart />
            <span className={styled.wishlist__text}>Избранное</span>
          </div>
        </Link>

        {session ? (
          <Link href={`profile`}>
            <div className={styled.profile}>
              <FaUser />
              <span className={styled.profile__text}>Аккаунт</span>
            </div>
          </Link>
        ) : (
          <div className={styled.profile}>
            <FaUser onClick={() => signIn()} />
            <span className={styled.profile__text}>Войти</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
