import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store from '@/store';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import Router, { useRouter } from 'next/router';
import '@/styles/globals.scss';
import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import StyledDotLoader from '@/components/Loaders/DotLoader';
import { Analytics } from '@vercel/analytics/react';
import { appWithTranslation } from 'next-i18next';
import { persistStore } from 'redux-persist';
import 'swiper/swiper-bundle.css';
import Footer from '@/components/Footer';
NProgress.configure({
  minimum: 0.1,
  easing: 'ease',
  speed: 700,
  showSpinner: false,
});

let persistor = persistStore(store);

function App({ Component, pageProps: { session, ...pageProps } }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    import('sweetalert2').then((Swal) => {
      window.Swal = Swal.default;
    });
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

  const showHeaderFooter = router.pathname !== '/signin' && !isAdminpath;
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
              <Component {...pageProps} />
              {showHeaderFooter && <Footer />}
              <Analytics />
            </PersistGate>
          </Provider>
        </SessionProvider>
      )}
    </>
  );
}

export default appWithTranslation(App);
