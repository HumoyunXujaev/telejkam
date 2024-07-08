/* eslint-disable @next/next/no-img-element */
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import Link from 'next/link';

import { SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import styled from './styles.module.scss';
import ProductCard from '@/components/ProductCard';
import CommonSwiper from './CommonSwiper';
import { useTranslation } from 'next-i18next';

export default function FeaturedProducts({ featuredProducts }) {
  const { t } = useTranslation();

  return (
    <div className={styled.featuredProducts}>
      <div className={styled.featuredProducts__title}>
        <div className={styled.flex}>
          <h3>{t('featured_products')}</h3>
          <img src='/images/featured-products.png' alt='' />
        </div>
        <Link href='/browse?sort=popular'>
          {t('see')}
          <MdOutlineKeyboardDoubleArrowRight />
        </Link>
      </div>
      <CommonSwiper>
        {featuredProducts.map((product, index) => {
          return (
            <SwiperSlide key={index}>
              <ProductCard product={product} />
            </SwiperSlide>
          );
        })}
      </CommonSwiper>
    </div>
  );
}
