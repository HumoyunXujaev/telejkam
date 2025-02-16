// import Link from 'next/link';
// import { useSelector } from 'react-redux';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { toast } from 'react-toastify';
// import NextImage from '../NextImage';
// import {
//   BottomNavigation,
//   BottomNavigationAction,
//   Drawer,
//   IconButton,
// } from '@mui/material';

// import styled from './styles.module.scss';
// import 'react-toastify/dist/ReactToastify.css';
// import HeaderCartItem from './HeaderCartItem';
// import {
//   calculateSubPrice,
//   calculateTotal,
//   calculateTotalShipping,
// } from '@/utils/productUltils';
// import { Button, Tooltip } from '@mui/material';
// import SearchResults from './SearchResults/';
// import axios from 'axios';
// import { signIn, useSession } from 'next-auth/react';
// import { useMediaQuery } from 'react-responsive';
// import Image from 'next/image';
// import { useTranslation } from 'next-i18next';
// import * as Icon from 'react-feather';

// const Main = ({ searchHandler2 }) => {
//   const isSmall = useMediaQuery({ maxWidth: 950 });

//   const { data: session } = useSession();

//   const { cart } = useSelector((state) => ({ ...state }));
//   const router = useRouter();
//   const [query, setQuery] = useState(router.query.search || '');
//   const [products, setProducts] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const { t } = useTranslation();
//   const [value, setValue] = useState('browse');
//   const [currentRoute, setCurrentRoute] = useState(
//     router.pathname.substring(1)
//   ); // Используйте substring, чтобы удалить первый символ "/"

//   const navItems = [
//     { label: 'Главная', icon: <Icon.Home />, route: '' },
//     { label: 'Каталог', icon: <Icon.Layers />, route: 'browse' },
//     // { label: 'Статус Заказа', icon: <Icon.Inbox />, route: 'order-status' },
//     { label: 'Корзина', icon: <Icon.ShoppingBag />, route: 'cart' },
//     { label: 'Избранное', icon: <Icon.Heart />, route: 'wishlist' },
//     {
//       label: 'Еще',
//       icon: <Icon.MoreHorizontal />,
//       onClick: () => setDrawerOpen(true),
//     },
//   ];

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//     setCurrentRoute(newValue);
//     router.push(`/${newValue}`); // Навигация на выбранный маршрут
//   };

//   const searchChangeHandler = (e) => {
//     setQuery(e.target.value);
//   };

//   useEffect(() => {
//     const timerId = setTimeout(async () => {
//       if (query.length > 0) {
//         setLoading(true);
//         const { data } = await axios(`/api/search?query=${query}`);
//         setProducts(data);
//         setLoading(false);
//       }
//     }, 500);

//     return () => {
//       clearTimeout(timerId);
//     };
//   }, [query]);

//   const searchHandler = (e) => {
//     e.preventDefault();

//     if (router.pathname == '/browse') {
//       searchHandler2(query);
//     } else {
//       if (query && query.trim().length > 0) {
//         router.push(`/browse?search=${query}`);
//       } else {
//         return toast.error('Invalid search query!');
//       }
//     }
//   };

//   return (
//     <div className={styled.main}>
//       <div className={styled.main__container}>
//         {isSmall && (
//           <div className={styled.drawer}>
//             <IconButton
//               onClick={() => setDrawerOpen(true)}
//               className={styled.drawerIcon}
//             >
//               <Icon.Menu size={20} />
//             </IconButton>

//             <Drawer
//               anchor='left'
//               open={drawerOpen}
//               onClose={() => setDrawerOpen(false)}
//             >
//               <div className={styled.drawer__container}>
//                 <div className={styled.drawer__header}>
//                   {/* <div className={styled.drawer__header__logo}> */}
//                   <Image
//                     src='/telejkam.png'
//                     alt='Logo Telejkam'
//                     width='85'
//                     height='85'
//                   />
//                   <br />
//                   <Link href={router.pathname} locale='ru'>
//                     <span>Рус</span>
//                   </Link>
//                   <Icon.Globe />
//                   <Link href={router.pathname} locale='uz'>
//                     <span>O`&apos;zb</span>
//                   </Link>

//                   {/* </div> */}
//                   <IconButton onClick={() => setDrawerOpen(false)}>
//                     <Icon.XCircle />
//                   </IconButton>
//                 </div>
//                 <div className={styled.drawer__body}>
//                   <Link href='browse'>
//                     <div className={styled.drawer__item}>
//                       <Icon.Layers size={20} />
//                       <span>{t('header.katalog')}</span>
//                     </div>
//                   </Link>
//                   {/* <Link href='/order-status/'>
//                     <div className={styled.drawer__item}>
//                       <Icon.Inbox />
//                       <span>{t('header.status')}</span>
//                     </div>
//                   </Link> */}
//                   <Link href='cart'>
//                     <div className={styled.drawer__item}>
//                       <Icon.ShoppingBag />
//                       <span>{t('header.cart')}</span>
//                     </div>
//                   </Link>
//                   <Link href={`wishlist`}>
//                     <div className={styled.drawer__item}>
//                       <Icon.Heart />
//                       <span>{t('header.heart')}</span>
//                     </div>
//                   </Link>
//                 </div>
//                 <div className={styled.drawer__body}>
//                   <h1>{t('header.contacts')}</h1>
//                   <Link href={`tel:+32213213312`}>
//                     <div className={styled.drawer__item}>
//                       <Image
//                         src={`icons/phone.png`}
//                         alt='phone'
//                         width='85'
//                         height='85'
//                       />
//                       <span>{t('header.phone')}</span>
//                     </div>
//                   </Link>

//                   <Link href={`https://www.google.com/maps/place/`}>
//                     <div className={styled.drawer__item}>
//                       <Image
//                         src={`icons/address.png`}
//                         alt='phone'
//                         width='85'
//                         height='85'
//                       />
//                       <span>{t('header.address')}</span>
//                     </div>
//                   </Link>
//                   <Link href={`https://www.telegram.com/`}>
//                     <div className={styled.drawer__item}>
//                       <Image
//                         src={`icons/tg.png`}
//                         alt='phone'
//                         width='85'
//                         height='85'
//                       />
//                       <span>Telegram</span>
//                     </div>
//                   </Link>
//                   <Link href={`https://www.instagram.com/telejkam.uz/`}>
//                     <div className={styled.drawer__item}>
//                       <Image
//                         src={`icons/insta.png`}
//                         alt='phone'
//                         width='85'
//                         height='85'
//                       />
//                       <span>Instagram</span>
//                     </div>
//                   </Link>
//                 </div>
//               </div>
//             </Drawer>
//           </div>
//         )}

//         {/* logo */}
//         <Link href='/'>
//           <div className={styled.logo}>
//             <NextImage src='/telejkam.png' alt='Logo Telejkam' />
//           </div>
//         </Link>

//         {/* link to catalog with mdmenu icon */}

//         <Link href='browse'>
//           <div className={styled.catalog}>
//             <Icon.Menu />
//             <span className={styled.catalog__text}>{t('header.katalog')}</span>
//           </div>
//         </Link>

//         {/* Search */}
//         <form onSubmit={searchHandler} className={styled.search}>
//           <input
//             type='text'
//             placeholder={t('header.search')}
//             onChange={searchChangeHandler}
//             value={query}
//             onBlur={() => setShowSearchResults(false)}
//             onFocus={() => setShowSearchResults(true)}
//           />
//           <SearchResults
//             products={products}
//             showSearchResults={showSearchResults}
//             query={query}
//             loading={loading}
//           />
//           <button type='submit' className={styled.search__icon}>
//             {loading && (
//               <span>
//                 <Icon.Loader />
//               </span>
//             )}
//             {!loading && <Icon.Search />}
//           </button>
//         </form>
//         {/* <Link href={`order-status`}> */}
//         {/* <div className={styled.orderStatus}>
//             <Icon.Inbox />
//             <span className={styled.orderStatus__text}>
//               {t('header.status')}
//             </span>
//             <div className={styled.cart__dropdown}>
//               <div className={styled.cart__empty}>
//                 <div className={styled.cart__empty_img}>
//                   <NextImage src='/images/empty-order-5.webp' />
//                 </div>
//                 <p>{t('header.status_check')}</p>
//                 <div className={styled.cart__empty_btn}>
//                   <Button
//                     variant='contained'
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       router.push('/browse');
//                     }}
//                   >
//                     {t('header.order_num')}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Link> */}

//         {/* Cart */}
//         <Link href='cart'>
//           <div className={styled.cart}>
//             <Icon.ShoppingBag />
//             <span className={styled.cart__number}>{cart.cartItems.length}</span>
//             <span className={styled.cart__text}>{t('header.cart')}</span>

//             <div className={styled.cart__dropdown}>
//               {cart.cartItems.length > 0 ? (
//                 <div>
//                   <div className={styled.cart__items}>
//                     {cart.cartItems.map((item) => (
//                       <HeaderCartItem key={item._uniqueId} item={item} />
//                     ))}
//                   </div>
//                   <div className={styled.cart__priceComponent}>
//                     <p>
//                       <span>{t('header.cart_price')} :</span>
//                       <span>{calculateSubPrice(cart.cartItems)}</span>
//                     </p>
//                     <p>
//                       <span>{t('header.cart_fee')} :</span>
//                       <span>{calculateTotalShipping(cart.cartItems)}</span>
//                     </p>
//                   </div>
//                   <div className={styled.cart__total}>
//                     <span>{t('header.cart_subtotal')}:</span>
//                     <span>{calculateTotal(cart.cartItems)}</span>
//                   </div>
//                   <div className={styled.cart__seeAll}>
//                     {t('header.cart_see')}
//                   </div>
//                 </div>
//               ) : (
//                 <div className={styled.cart__empty}>
//                   <div className={styled.cart__empty_img}>
//                     <NextImage src='/images/empty.png' />
//                   </div>
//                   <p>{t('header.cart_empty')}</p>
//                   <div className={styled.cart__empty_btn}>
//                     <Button
//                       variant='contained'
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         router.push('/browse');
//                       }}
//                     >
//                       {t('header.cart_shopping')}
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </Link>
//         <Link href={`wishlist`}>
//           <div className={styled.wishlist}>
//             <Icon.Heart />
//             <span className={styled.wishlist__text}>{t('header.heart')}</span>
//           </div>
//         </Link>
//       </div>

//       {isSmall && (
//         <BottomNavigation
//           value={value}
//           onChange={handleChange}
//           showLabels
//           className={styled.navigation}
//           style={{
//             position: 'fixed',
//             height: '90px',
//             bottom: 0,
//             zIndex: 1000,
//             width: '100%',
//             backgroundColor: '#fff',
//             borderTop: '1px solid #ccc',
//           }}
//         >
//           {navItems.map((item) =>
//             item.onClick ? (
//               <IconButton key={item.route} onClick={item.onClick}>
//                 {item.icon}
//               </IconButton>
//             ) : (
//               <BottomNavigationAction
//                 key={item.route}
//                 label={item.label}
//                 value={item.route}
//                 icon={item.icon}
//                 style={{
//                   color: currentRoute === item.route ? '#2196f3' : '#000',
//                 }}
//               />
//             )
//           )}
//         </BottomNavigation>
//       )}
//     </div>
//   );
// };

// export default Main;

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import NextImage from '../NextImage';
import {
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  IconButton,
} from '@mui/material';
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
import { signIn, useSession } from 'next-auth/react';
import { useMediaQuery } from 'react-responsive';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import * as Icon from 'react-feather';

const Main = ({ searchHandler2, settings }) => {
  const isSmall = useMediaQuery({ maxWidth: 950 });
  const { data: session } = useSession();
  const { cart } = useSelector((state) => ({ ...state }));
  const router = useRouter();
  const [query, setQuery] = useState(router.query.search || '');
  const [products, setProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();
  const [value, setValue] = useState('browse');
  const [currentRoute, setCurrentRoute] = useState(
    router.pathname.substring(1)
  );

  const navItems = [
    { label: 'Главная', icon: <Icon.Home />, route: '' },
    { label: 'Каталог', icon: <Icon.Layers />, route: 'browse' },
    { label: 'Корзина', icon: <Icon.ShoppingBag />, route: 'cart' },
    { label: 'Избранное', icon: <Icon.Heart />, route: 'wishlist' },
    {
      label: 'Еще',
      icon: <Icon.MoreHorizontal />,
      onClick: () => setDrawerOpen(true),
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentRoute(newValue);
    router.push(`/${newValue}`);
  };

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

  // Add this function to handle navigation with full paths
  const handleNavigation = (path) => {
    router.push(`/${path}`);
  };

  return (
    <div className={styled.main}>
      <div className={styled.main__container}>
        {isSmall && (
          <div className={styled.drawer}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              className={styled.drawerIcon}
            >
              <Icon.Menu size={20} />
            </IconButton>
            <Drawer
              anchor='left'
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <div className={styled.drawer__container}>
                <div className={styled.drawer__header}>
                  <Image
                    src='/telejkam.png'
                    alt='Logo Telejkam'
                    width='85'
                    height='85'
                  />
                  <br />
                  <Link href={router.pathname} locale='ru'>
                    <span>Рус</span>
                  </Link>
                  <Icon.Globe />
                  <Link href={router.pathname} locale='uz'>
                    <span>O`zb</span>
                  </Link>
                  <IconButton onClick={() => setDrawerOpen(false)}>
                    <Icon.XCircle />
                  </IconButton>
                </div>
                <div className={styled.drawer__body}>
                  <div
                    onClick={() => handleNavigation('browse')}
                    className={styled.drawer__item}
                  >
                    <Icon.Layers size={20} />
                    <span>{t('header.katalog')}</span>
                  </div>
                  <div
                    onClick={() => handleNavigation('cart')}
                    className={styled.drawer__item}
                  >
                    <Icon.ShoppingBag />
                    <span>{t('header.cart')}</span>
                  </div>
                  <div
                    onClick={() => handleNavigation('wishlist')}
                    className={styled.drawer__item}
                  >
                    <Icon.Heart />
                    <span>{t('header.heart')}</span>
                  </div>
                </div>
                <div className={styled.drawer__body}>
                  <h1>{t('header.contacts')}</h1>
                  <a href={`${'tel:' + settings?.contacts?.phone}`}>
                    <span>{settings?.contacts?.phone}</span>
                  </a>
                  {/* <Link href={`${'tel:' + settings?.contacts?.phone}`}> */}
                  <div className={styled.drawer__item}>
                    <Image
                      src={`icons/phone.png`}
                      alt='phone'
                      width='85'
                      height='85'
                    />
                    <span>{t('header.phone')}</span>
                  </div>
                  {/* </Link> */}
                  <a href={settings?.contacts?.location}>
                    <div className={styled.drawer__item}>
                      <Image
                        src={`icons/address.png`}
                        alt='phone'
                        width='85'
                        height='85'
                      />
                      <span>{t('header.address')}</span>
                    </div>
                  </a>
                  <a href={settings?.contacts?.telegram}>
                    <div className={styled.drawer__item}>
                      <Image
                        src={`icons/tg.png`}
                        alt='phone'
                        width='85'
                        height='85'
                      />
                      <span>Telegram</span>
                    </div>
                  </a>
                  <a href={settings?.contacts?.instagram}>
                    <div className={styled.drawer__item}>
                      <Image
                        src={`icons/insta.png`}
                        alt='phone'
                        width='85'
                        height='85'
                      />
                      <span>Instagram</span>
                    </div>
                  </a>
                </div>
              </div>
            </Drawer>
          </div>
        )}

        <Link href='/'>
          <div className={styled.logo}>
            <NextImage src='/telejkam.png' alt='Logo Telejkam' />
          </div>
        </Link>

        <div
          onClick={() => handleNavigation('browse')}
          className={styled.catalog}
        >
          <Icon.Menu />
          <span className={styled.catalog__text}>{t('header.katalog')}</span>
        </div>

        <form onSubmit={searchHandler} className={styled.search}>
          <input
            type='text'
            placeholder={t('header.search')}
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
                <Icon.Loader />
              </span>
            )}
            {!loading && <Icon.Search />}
          </button>
        </form>

        <div onClick={() => handleNavigation('cart')} className={styled.cart}>
          <Icon.ShoppingBag />
          <span className={styled.cart__number}>{cart.cartItems.length}</span>
          <span className={styled.cart__text}>{t('header.cart')}</span>
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
                    <span>{t('header.cart_price')} :</span>
                    <span>{calculateSubPrice(cart.cartItems)}</span>
                  </p>
                  <p>
                    <span>{t('header.cart_fee')} :</span>
                    <span>{calculateTotalShipping(cart.cartItems)}</span>
                  </p>
                </div>
                <div className={styled.cart__total}>
                  <span>{t('header.cart_subtotal')}:</span>
                  <span>{calculateTotal(cart.cartItems)}</span>
                </div>
                <div className={styled.cart__seeAll}>
                  {t('header.cart_see')}
                </div>
              </div>
            ) : (
              <div className={styled.cart__empty}>
                <div className={styled.cart__empty_img}>
                  <NextImage src='/images/empty.png' />
                </div>
                <p>{t('header.cart_empty')}</p>
                <div className={styled.cart__empty_btn}>
                  <Button
                    variant='contained'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push('/browse');
                    }}
                  >
                    {t('header.cart_shopping')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          onClick={() => handleNavigation('wishlist')}
          className={styled.wishlist}
        >
          <Icon.Heart />
          <span className={styled.wishlist__text}>{t('header.heart')}</span>
        </div>
      </div>

      {isSmall && (
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels
          className={styled.navigation}
          style={{
            position: 'fixed',
            height: '90px',
            bottom: 0,
            zIndex: 1000,
            width: '100%',
            backgroundColor: '#fff',
            borderTop: '1px solid #ccc',
          }}
        >
          {navItems.map((item) =>
            item.onClick ? (
              <IconButton key={item.route} onClick={item.onClick}>
                {item.icon}
              </IconButton>
            ) : (
              <BottomNavigationAction
                key={item.route}
                label={item.label}
                value={item.route}
                icon={item.icon}
                style={{
                  color: currentRoute === item.route ? '#2196f3' : '#000',
                }}
              />
            )
          )}
        </BottomNavigation>
      )}
    </div>
  );
};

export default Main;
