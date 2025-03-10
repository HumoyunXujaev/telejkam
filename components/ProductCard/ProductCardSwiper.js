'use client';

import { useEffect, useRef } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styled from './styles.module.scss';
import NextImage from '../NextImage';

const ProductCardSwiper = ({ images }) => {
  const swiperRef = useRef(null);
  //Dừng autoplay khi vừa load trang
  useEffect(() => {
    swiperRef.current.swiper.autoplay.stop();
  }, [swiperRef]);

  return (
    <div
      className={styled.swiper}
      //Khởi động lại autoplay khi hover vào Swiper
      onMouseEnter={() => {
        swiperRef.current.swiper.autoplay.start();
      }}
      //Ngừng autoplay sau khi không còn hover vào Swiper
      onMouseLeave={() => {
        swiperRef.current.swiper.autoplay.stop();
        //Tự động chuyển về ảnh đầu tiên
        swiperRef.current.swiper.slideTo(0);
      }}
    >
      <Swiper
        ref={swiperRef}
        centeredSlides={true}
        autoplay={{ delay: 500, stopOnLastSlide: false }}
        speed={500}
        modules={[Autoplay]}
      >
        {images?.map((img, index) => (
          <SwiperSlide key={index}>
            <div className={styled.product__infos_img}>
              <NextImage src={img.url} alt='' />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCardSwiper;
