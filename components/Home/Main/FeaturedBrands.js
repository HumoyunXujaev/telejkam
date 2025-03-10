'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';

import { SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import styled from './styles.module.scss';
import NextImage from '@/components/NextImage';
import CommonSwiper2 from './CommonSwiper2';

export default function FeaturedBrands({ featuredBrands }) {
  console.log(featuredBrands);
  return (
    <div className={styled.featuredBrands}>
      <div className={styled.featuredBrands__title}>
        <h3>Genuine Brands</h3>
        <img src='/images/official.png' alt='Official' />
      </div>
      <CommonSwiper2>
        {featuredBrands.length > 0 ? (
          featuredBrands.map((brand, index) => (
            <SwiperSlide key={index}>
              <div className={styled.featuredBrands__container} href=''>
                <Link className={styled.featuredBrands__item} href={`/browse`}>
                  <h4 style={{ color: 'black' }}>{brand.name}</h4>
                </Link>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p>No featured brands available</p>
        )}
      </CommonSwiper2>
    </div>
  );
}
