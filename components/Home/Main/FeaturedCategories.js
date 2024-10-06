'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import NextImage from '@/components/NextImage';

import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import styled from './styles.module.scss';
import CommonSwiper2 from './CommonSwiper2';
import { useTranslation } from 'next-i18next';

export default function FeaturedCategories({ featuredCategories }) {
  const { t } = useTranslation();

  const categories = featuredCategories?.map((category) => category);
  console.log(categories);
  return (
    <div className={styled.featuredCategories}>
      <div className={styled.featuredCategories__title}>
        <h3>{t('featured_categories')}</h3>
        <img src='/images/top-categories.png' alt='Official' />
      </div>
      <CommonSwiper2>
        {/* {menuArray
          .filter((c) => c.featured) */}
        {categories &&
          categories.length > 0 &&
          categories.map((category, index) => {
            return (
              <SwiperSlide key={index}>
                <Link
                  className={styled.featuredCategories__item}
                  href={`/browse?category=${category?.slug}`}
                >
                  {/* <div style={{ display: 'grid', placeItems: 'center' }}>
                    <div className={styled.featuredCategories__item_img}>
                      <NextImage
                        src={`/images/featured-category/${category.featuredImg}`}
                        alt=''
                      />
                    </div>
                  </div> */}
                  <h4>{category?.name}</h4>
                </Link>
              </SwiperSlide>
            );
          })}
      </CommonSwiper2>
    </div>
  );
}
