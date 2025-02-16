import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store from '@/store';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import Router, { useRouter } from 'next/router';
import '@/styles/globals.scss';
import { useEffect, useState, useCallback } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import StyledDotLoader from '@/components/Loaders/DotLoader';
import { Analytics } from '@vercel/analytics/react';
import { appWithTranslation } from 'next-i18next';
import { persistStore } from 'redux-persist';
import 'swiper/swiper-bundle.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Settings } from '@/models/Settings';

NProgress.configure({
  minimum: 0.1,
  easing: 'ease',
  speed: 700,
  showSpinner: false,
});

let persistor = persistStore(store);

function App({ Component, pageProps: { session, ...pageProps }, settings }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    import('sweetalert2').then((Swal) => {
      window.Swal = Swal.default;
    });
    console.log(settings, 'settings');
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      setLoading(true);
      NProgress.start();
    };

    const handleRouteComplete = (url) => {
      setLoading(false);
      NProgress.done();
    };

    Router.events.on('routeChangeStart', handleRouteChange);
    Router.events.on('routeChangeComplete', handleRouteComplete);
    Router.events.on('routeChangeError', handleRouteComplete);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChange);
      Router.events.off('routeChangeComplete', handleRouteComplete);
      Router.events.off('routeChangeError', handleRouteComplete);
    };
  }, []);
  const router = useRouter();
  const isAdminpath = router.pathname.startsWith('/admin');

  const showHeaderFooter =
    router.pathname !== '/signin' &&
    !isAdminpath &&
    router.pathname !== '/browse';

  const filter = useCallback(
    ({
      search,
      category,
      brand,
      style,
      pattern,
      material,
      size,
      // color,
      gender,
      price,
      shipping,
      rating,
      sort,
      page,
    }) => {
      const path = router.pathname;
      if (search) router.query.search = search;
      if (category) router.query.category = category;
      if (brand) router.query.brand = brand;
      if (style) router.query.style = style;
      if (pattern) router.query.pattern = pattern;
      if (material) router.query.material = material;
      if (size) router.query.size = size;
      // if (color) router.query.color = color;
      if (gender) router.query.gender = gender;
      if (price) router.query.price = price;
      if (shipping) router.query.shipping = shipping;
      if (rating) router.query.rating = rating;
      if (sort) router.query.sort = sort;
      if (page) router.query.page = page;

      router.push({ pathname: path, query: router.query }, undefined, {
        scroll: false,
      });
    },
    [router]
  );

  const searchHandler = useCallback(
    (search) => {
      if (search === '') {
        filter({ search: '' });
      } else {
        filter({ search });
      }
    },
    [filter]
  );

  return (
    <>
      <Head>
        <title>Telejkam</title>
        <meta
          name='description'
          content='Telejkam-online shopping service for all of your needs.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/telejkam1.png' />
      </Head>
      {loading ? (
        <StyledDotLoader />
      ) : (
        <SessionProvider session={session}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
              />
              {showHeaderFooter && (
                <Header searchHandler={searchHandler} settings={settings} />
              )}
              <Component {...pageProps} settings={settings} />
              {showHeaderFooter && <Footer settings={settings} />}
              <Analytics />
            </PersistGate>
          </Provider>
        </SessionProvider>
      )}
    </>
  );
}

App.getInitialProps = async (ctx) => {
  await db.connectDb();

  // Fetch settings
  const settings = await Settings.findOne({}).lean();
  await db.disConnectDb();

  const defaultSettings = {
    heroImages: [],
    contacts: {
      phone: '',
      address: '',
      telegram: '',
      instagram: '',
      location: '',
    },
  };

  // Get the existing pageProps from any page's getInitialProps/getStaticProps/getServerSideProps
  let pageProps = {};
  if (ctx.Component.getInitialProps) {
    pageProps = await ctx.Component.getInitialProps(ctx);
  }

  return {
    pageProps,
    settings: JSON.parse(JSON.stringify(settings || defaultSettings)),
  };
};

export default appWithTranslation(App);
