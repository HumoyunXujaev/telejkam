import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const SimilarSwiper = ({ product }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSimilars = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/product/${product._id}/similar`);
        setSimilarProducts(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(
          error.response?.data?.message || 'Error fetching similar products'
        );
      }
    };

    fetchSimilars();
  }, [product._id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='similar-products-container'>
      <h2 className='similar-products-title'>{t('similar_products')}</h2>
      <Swiper
        slidesPerView={2}
        spaceBetween={20}
        navigation={true}
        modules={[Navigation]}
        className='similar-swiper'
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
      >
        {similarProducts.map((p, index) => (
          <SwiperSlide key={index}>
            <Link
              href={`/product/${p.slug}?style=0&size=0`}
              className='product-link'
            >
              <div className='product-card'>
                <div className='product-image-container'>
                  <Image
                    src={p.image}
                    alt={p.name}
                    layout='fill'
                    objectFit='cover'
                    className='product-image'
                  />
                </div>
                <h4 className='product-name'>{p.name}</h4>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx>{`
        .similar-products-container {
          padding: 20px 0;
        }
        .similar-products-title {
          text-align: center;
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: 600;
        }
        .similar-swiper {
          padding: 20px 0;
        }
        .product-link {
          text-decoration: none;
          color: inherit;
        }
        .product-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
        .product-image-container {
          position: relative;
          width: 100%;
          padding-top: 100%; /* 1:1 Aspect Ratio */
        }
        .product-image {
          border-radius: 8px 8px 0 0;
        }
        .product-name {
          padding: 10px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default SimilarSwiper;
