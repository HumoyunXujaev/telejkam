/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import styled from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Navigation } from 'swiper';
import NextImage from '../NextImage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';

import { toast } from 'react-toastify';

export default function SimilarSwiper({ product }) {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSimilars = async () => {
      const { data } = await axios.get(`/api/product/${product._id}/similar`);
      setSimilarProducts(data);
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
            <Link
              href={`/product/${p.slug}?style=0`}
              className={styled.similar__img}
            >
              <NextImage src={p.image} alt={p.slug} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
