/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import styled from './styles.module.scss';
import ProductCard from '@/components/ProductCard';
import CommonSwiper from './CommonSwiper';
import { useTranslation } from 'next-i18next';
import * as Icon from 'react-feather';

export default function FreeShippingProducts({ freeShippingProducts }) {
  const { t } = useTranslation();

  return (
    <div className={styled.freeShippingProducts}>
      <div className={styled.freeShippingProducts__title}>
        <div className={styled.flex}>
          <h3>{t('free_shipping')}</h3>
          <img src='/images/free-ship.png' alt='' />
        </div>
        <Link href='/browse?shipping=Free'>
          {t('see')}
          <Icon.ChevronsRight />
        </Link>
      </div>
      <CommonSwiper>
        {freeShippingProducts.map((product, index) => {
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
