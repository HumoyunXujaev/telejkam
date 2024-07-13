'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import styled from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Navigation } from 'swiper';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function SimilarSwiper({ product }) {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSimilars = async () => {
      const { data } = await axios.get(`/api/product/${product._id}/similar`);
      setSimilarProducts(data);
      console.log(data);
    };

    try {
      setLoading(true);
      fetchSimilars();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  }, []);

  console.log(similarProducts, 'similar ');
  return (
    <div style={{ padding: '10px' }}>
      <h1 style={{ textAlign: 'center', padding: '10px' }}>
        {t('similar_products')}
      </h1>

      <Swiper
        slidesPerView={4}
        spaceBetween={1}
        slidesPerGroup={3}
        navigation={true}
        modules={[Navigation]}
        className='similar_swiper products_swiper'
        rewind={true}
        breakpoints={{
          640: {
            width: 640,
            slidesPerView: 4,
          },
        }}
      >
        {similarProducts.map((p, index) => (
          <SwiperSlide key={index}>
            <div className={`${styled.product}`} key={index}>
              <div className={styled.product__container} key={index}>
                <Link href={`/product/${p.slug}?style=0&size=0`} key={index}>
                  <div style={{ position: 'relative' }}>
                    <Image src={p.image} alt='fds' width={100} height={100} />
                  </div>

                  <h4
                    style={{
                      textAlign: 'center',
                      color: 'black',
                      fontWeight: '600',
                      overflowWrap: 'break-word',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    {p.name}
                  </h4>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
