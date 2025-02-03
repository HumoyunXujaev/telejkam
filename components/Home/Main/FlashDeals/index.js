import React, { useEffect, useState } from 'react';
import Countdown from '@/components/Countdown';
import styled from './styles.module.scss';
import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import FlashCard from './FlashCard';
import CommonSwiper from '../CommonSwiper';
import { useTranslation } from 'next-i18next';
import axios from 'axios';

const FlashDeals = ({ flashDeals }) => {
  const { t } = useTranslation();
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchEndDate = async () => {
      try {
        const { data } = await axios.get('/api/admin/settings');
        setEndDate(new Date(data.flashDealsEndDate));
      } catch (error) {
        console.error('Error fetching flash deals end date:', error);
      }
    };

    fetchEndDate();
  }, []);

  return (
    <div className={styled.flashDeals}>
      <div className={styled.flashDeals__title}>
        <Countdown date={endDate} />
        <h3>
          <span>{t('flash_deals')}</span>
          <img src='/images/limited.png' alt='' />
        </h3>
      </div>
      <CommonSwiper>
        <div className={styled.flashDeals__list}>
          {flashDeals.map((item, index) => (
            <SwiperSlide key={index}>
              <FlashCard product={item} />
            </SwiperSlide>
          ))}
        </div>
      </CommonSwiper>
    </div>
  );
};

export default FlashDeals;
