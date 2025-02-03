// 'use client';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import 'swiper/swiper-bundle.css';

// import { Pagination, Navigation, Autoplay } from 'swiper';
// import styled from './styles.module.scss';
// import NextImage from '@/components/NextImage';

// export default function App() {
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

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper';
import axios from 'axios';
import styled from './styles.module.scss';
import NextImage from '@/components/NextImage';

export default function MainSwiper() {
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/admin/settings');
        console.log(data, 'hero images');
        setHeroImages(data.heroImages);
      } catch (error) {
        console.error('Error fetching hero images:', error);
      }
    };

    fetchSettings();
  }, []);

  {
    [...Array(heroImages).keys()].map((i) => console.log(i));
  }
  console.log(heroImages, 'imgs');

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
      {heroImages.map((image, i) => (
        <SwiperSlide key={i}>
          <div className={styled.mainSwiper__wrapper}>
            <NextImage src={image.url} alt={image.alt} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
