import Link from 'next/link';
import { RiSearch2Line } from 'react-icons/ri';
import { FaBox, FaBoxOpen, FaHeart, FaOpencart, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import NextImage from '../NextImage';
import { Drawer, IconButton } from '@mui/material';

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
import { MdClose, MdDashboard, MdMenu } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import Image from 'next/image';
const Main = ({ searchHandler2 }) => {
  const isSmall = useMediaQuery({ maxWidth: 950 });

  const { data: session } = useSession();

  const { cart } = useSelector((state) => ({ ...state }));
  const router = useRouter();
  const [query, setQuery] = useState(router.query.search || '');
  const [products, setProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      searchHandler2(query);
    } else {
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
        {isSmall && (
          <div className={styled.drawer}>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MdMenu size={20} />
            </IconButton>
            <Drawer
              anchor='left'
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <div className={styled.drawer__container}>
                <div className={styled.drawer__header}>
                  {/* <div className={styled.drawer__header__logo}> */}
                  <Image
                    src='/telejkam.png'
                    alt='Logo Telejkam'
                    width='85'
                    height='85'
                  />
                  {/* </div> */}
                  <IconButton onClick={() => setDrawerOpen(false)}>
                    <MdClose />
                  </IconButton>
                </div>
                <div className={styled.drawer__body}>
                  <Link href='browse'>
                    <div className={styled.drawer__item}>
                      <MdDashboard size={20} />
                      <span>Каталог</span>
                    </div>
                  </Link>
                  <Link href='/order-status/'>
                    <div className={styled.drawer__item}>
                      <FaBox />
                      <span>Статус заказа</span>
                    </div>
                  </Link>
                  <Link href='cart'>
                    <div className={styled.drawer__item}>
                      <FaOpencart />
                      <span>Корзина</span>
                    </div>
                  </Link>
                  <Link href={`wishlist`}>
                    <div className={styled.drawer__item}>
                      <FaHeart />
                      <span>Избранное</span>
                    </div>
                  </Link>
                  {session ? (
                    <Link href={`profile`}>
                      <div className={styled.drawer__item}>
                        <FaUser />
                        <span>Аккаунт</span>
                      </div>
                    </Link>
                  ) : (
                    <div className={styled.drawer__item}>
                      <FaUser onClick={() => signIn()} />
                      <span>Войти</span>
                    </div>
                  )}
                </div>
                <div className={styled.drawer__body}>
                  <h1>Контакты</h1>
                  <Link href={`tel:+32213213312`}>
                    <div className={styled.drawer__item}>
                      <Image
                        src={`icons/phone.png`}
                        alt='phone'
                        width='85'
                        height='85'
                      />
                      <span>Телефон</span>
                    </div>
                  </Link>
                  {/* <Link href={`mailto:hujaevhumoyun01@gmail.com`}>
                    <div className={styled.drawer__item}>
                      <Image
                        src={`icons/email.png`}
                        alt='phone'
                        width='85'
                        height='85'
                      />
                      <span>Почта</span>
                    </div>
                  </Link> */}
                  <Link href={`https://www.google.com/maps/place/`}>
                    <div className={styled.drawer__item}>
                      <Image
                        src={`icons/address.png`}
                        alt='phone'
                        width='85'
                        height='85'
                      />
                      <span>Адресс</span>
                    </div>
                  </Link>
                  <Link href={`https://www.telegram.com/`}>
                    <div className={styled.drawer__item}>
                      <Image
                        src={`icons/tg.png`}
                        alt='phone'
                        width='85'
                        height='85'
                      />
                      <span>Telegram</span>
                    </div>
                  </Link>
                  <Link href={`https://www.instagram.com/`}>
                    <div className={styled.drawer__item}>
                      <Image
                        src={`icons/insta.png`}
                        alt='phone'
                        width='85'
                        height='85'
                      />
                      <span>Instagram</span>
                    </div>
                  </Link>
                  {/* <Link href={`https://www.youtube.com/`}>
                    <div className={styled.drawer__item}>
                      <Image
                        src={`icons/yt.png`}
                        alt='phone'
                        width='85'
                        height='85'
                      />
                      <span>Youtube</span>
                    </div>
                  </Link> */}
                </div>
              </div>
            </Drawer>
          </div>
        )}

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
