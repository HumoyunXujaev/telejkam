'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/swiper-bundle.css';

import { Pagination, Navigation, Autoplay } from 'swiper';
import styled from './styles.module.scss';
import NextImage from '@/components/NextImage';

export default function App({ heroImages = [] }) {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation, Autoplay]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      className='mainSwiper'
    >
      {heroImages.length > 0
        ? heroImages
            .sort((a, b) => a.order - b.order)
            .map((image, i) => (
              <SwiperSlide key={image.url}>
                <div className={styled.mainSwiper__wrapper}>
                  <NextImage src={image.url} alt={`Hero Banner ${i + 1}`} />
                </div>
              </SwiperSlide>
            ))
        : // Fallback default images if no hero images are set
          [...Array(3)].map((_, i) => (
            <SwiperSlide key={i}>
              <div className={styled.mainSwiper__wrapper}>
                <NextImage
                  src={`/images/swiper/${i + 1}.jpg`}
                  alt={`Default Banner ${i + 1}`}
                />
              </div>
            </SwiperSlide>
          ))}
    </Swiper>
  );
}
//   return (
//     <>
//       <Swiper
//         slidesPerView={1}
//         spaceBetween={30}
//         loop={true}
//         pagination={{
//           clickable: true,
//         }}
//         navigation={true}
//         modules={[Pagination, Navigation, Autoplay]}
//         autoplay={{
//           delay: 2500,
//           disableOnInteraction: false,
//         }}
//         className='mainSwiper'
//       >
//         {[...Array(3).keys()].map((i) => (
//           <SwiperSlide key={i}>
//             <div className={styled.mainSwiper__wrapper}>
//               <NextImage
//                 src={`/images/swiper/${i + 1}.jpg`}
//                 alt={`Home Banner ${i + 1}`}
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </>
//   );
// }
