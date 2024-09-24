import AnimateWrapper from '@/components/AnimateWrapper';
import BreadCrumb from '@/components/BreadCrumb';
import Header from '@/components/Header';
import NextImage from '@/components/NextImage';
import ProductCard from '@/components/ProductCard';
import styled from '@/styles/Browse.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';

export default function Wishlist() {
  const { t } = useTranslation();

  const [wishlist, setWishlist] = useState([]);
  const [images, setImages] = useState([]);

  const isMedium = useMediaQuery({ query: '(max-width: 1023px)' });
  const isLarge = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(wishlist);
    const productImages = wishlist.map((product) =>
      product.subProducts.map((subproduct) =>
        subproduct.images.map((image) => image?.url)
      )
    );
    const flatImages = productImages.flat(3); // Flatten the nested arrays
    setImages(flatImages);
  }, []);

  const removeFromWishlistHandler = (id) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    toast.success(t('product_deleted'));
  };

  return (
    <div className={styled.browse}>
      <Header />
      <div className={styled.browse__container}>
        <AnimateWrapper>
          <div className={styled.browse__path}>
            <BreadCrumb
              category={'Wishlist'}
              categoryLink='/wishlist'
              subCategories={[]}
            />
          </div>
        </AnimateWrapper>
        <div className={styled.browse__store_products_wrap}>
          <div className={styled.browse__store_products}>
            {wishlist.length < 1 ? (
              <h1 style={{ textAlign: 'center' }}>{t('no_products')}</h1>
            ) : (
              wishlist.map((product, index) => (
                <AnimateWrapper delay={50 * index} key={product._id}>
                  <ProductCard
                    product={product}
                    className={
                      isLarge ? 'grid__4' : isMedium ? 'grid__3' : 'grid__2'
                    }
                    remove={removeFromWishlistHandler}
                  />
                </AnimateWrapper>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
