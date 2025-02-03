'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@mui/material';
import { SlideshowLightbox } from 'lightbox.js-react';
import 'lightbox.js-react/dist/index.css';
import * as Icon from 'react-feather';
import styled from './styles.module.scss';
import NextImage from '../NextImage';

const MainSwiper = ({ images = [] }) => {
  // Ensure images is always an array, defaulting to an empty array
  const safeImages =
    images && images.length > 0 ? images : [{ url: '/images/no_image.png' }];

  //Sửa lại format của Array ảnh để truyền SlideshowLightbox
  let lightBoxFormArr = safeImages?.map((img, i) => {
    return { src: img?.url || '/images/no_image.png' };
  });

  //State images của SlideshowLightbox
  const [ImagesArr, setImagesArr] = useState(lightBoxFormArr);
  const [active, setActive] = useState(0);
  const [showMaginify, setShowMagnify] = useState(false);
  const activeImgRef = useRef();
  const magnifyRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    setActive(0);
  }, [safeImages]);

  useEffect(() => {
    setImagesArr(
      safeImages.map((img, i) => {
        return { src: img?.url || '/images/no_image.png' };
      })
    );
  }, [safeImages]);

  const imgMouseMoveHandler = (e) => {
    // Hiện kính lúp
    setShowMagnify(true);
    // Ảnh được active
    const activeImg = activeImgRef.current;
    // Kính lúp
    const magnify = magnifyRef?.current;
    // Nếu đối tượng kính lúp bị gỡ thì thoát hàm
    if (!magnify) {
      return;
    }
    // Kích thước ảnh sau khi được zoom
    const scope = 2;
    const magnifyBgWidth = activeImg.offsetWidth * scope;
    const magnifyBgHeight = activeImg.offsetHeight * scope;

    // Vị trí của activeImg so với Document
    const activeImgtoDocTop =
      activeImg.getBoundingClientRect().top + window.scrollY;
    const activeImgtoDocLeft =
      activeImg.getBoundingClientRect().left + window.scrollX;

    // Vị trí của trỏ chuột so với activeImg
    // = Vị trí trỏ chuột so với document - Vị trí active Img so với Document
    let mouseOnImageX = e.pageX - activeImgtoDocLeft;
    let mouseOnImageY = e.pageY - activeImgtoDocTop;

    // Quy đổi ra phần trăm
    let mouseOnImageXPercent = (mouseOnImageX / activeImg.offsetWidth) * 100;
    let mouseOnImageYPercent = (mouseOnImageY / activeImg.offsetHeight) * 100;

    Object.assign(magnify.style, {
      top: e.clientY + 'px',
      left: e.clientX + 'px',
      backgroundImage: `url(${
        safeImages[active]?.url || '/images/no_image.png'
      })`,
      backgroundSize: `${magnifyBgWidth}px ${magnifyBgHeight}px`,
      backgroundPosition: `${mouseOnImageXPercent}% ${mouseOnImageYPercent}%`,
    });
  };

  const imgMouseLeaveHandler = (e) => {
    setShowMagnify(false);
  };

  //Click vào ảnh nào, ảnh đó được đẩy lên đầu mảng images truyền vào SlideshowLightbox
  const activeImgClickHandler = (activeImg) => {
    const newImagesArr = [...ImagesArr];
    const imgObj = newImagesArr.find((img, i) => {
      return img.src == activeImg.toString();
    });
    const imgObjIndex = newImagesArr.indexOf(imgObj);
    newImagesArr.splice(imgObjIndex, 1);
    newImagesArr.unshift({ src: activeImg });
    setImagesArr(newImagesArr);
  };

  const containerScrollHandler = (dir) => {
    const container = containerRef.current;
    let scrollAmount =
      dir === 'up'
        ? container.scrollTop - (container.offsetHeight + 20)
        : container.scrollTop + (container.offsetHeight + 20);

    container.scrollTo({
      top: scrollAmount,
      behaviour: 'smooth',
    });

    // if (scrollAmount > container.offsetHeight) {
    //   scrollAmount = 0;
    // }
  };

  return (
    <div className={styled.swiper}>
      <div className={styled.swiper__active}>
        {showMaginify && (
          <div className={styled.magnify} ref={magnifyRef}></div>
        )}
        {!showMaginify && (
          <div className={styled.hint}>
            <Icon.PlusCircle />
            <span>Нажмите или Наведите</span>
          </div>
        )}
        <SlideshowLightbox
          lightboxIdentifier='l2'
          framework='next'
          images={ImagesArr}
          theme='day'
        >
          <Image
            src={safeImages[active]?.url || '/images/no_image.png'}
            alt=''
            ref={activeImgRef}
            onMouseMove={imgMouseMoveHandler}
            onMouseLeave={imgMouseLeaveHandler}
            data-lightboxjs='l2'
            quality={1000}
            onClick={() =>
              activeImgClickHandler(
                safeImages[active]?.url || '/images/no_image.png'
              )
            }
            fill={true}
          />
        </SlideshowLightbox>
      </div>
      <div className={styled.swiper__list}>
        <Button
          variant='contained'
          onClick={() => containerScrollHandler('up')}
        >
          <Icon.ChevronsUp />
        </Button>
        <div className={styled.swiper__list_container} ref={containerRef}>
          {safeImages.map((img, index) => {
            return (
              <div
                className={`${styled.swiper__list_item} ${
                  index === active && styled.active
                }`}
                key={index}
                onMouseOver={() => setActive(index)}
              >
                <NextImage src={img?.url || '/images/no_image.png'} alt='' />
              </div>
            );
          })}
        </div>
        <Button
          variant='contained'
          onClick={() => containerScrollHandler('down')}
        >
          <Icon.ChevronsDown />
        </Button>
      </div>
    </div>
  );
};

export default MainSwiper;
