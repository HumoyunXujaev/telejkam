/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

import styled from './styles.module.scss';
import { CgColorPicker } from 'react-icons/cg';
import { ColorExtractor } from 'react-color-extractor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Colors({
  product,
  setProduct,
  name,
  colorImage,
  setColorImage,
  images,
  ...props
}) {
  const [colors, setColors] = useState([]);

  const renderSwatches = () => {
    return colors.map((color, id) => {
      return (
        <div className={styled.square__color} key={id}>
          <div
            className={styled.square__color_fill}
            style={{ backgroundColor: color }}
            onClick={() => {
              setProduct({
                ...product,
                color: {
                  color,
                  image: product.color.image,
                },
              });
              toast.success('Успешно выбран цвет продукта!');
            }}
          ></div>
          <span className={styled.square__color_text} style={{ color: color }}>
            {color}
          </span>
        </div>
      );
    });
  };

  return (
    <div className={styled.colors}>
      <input
        type='text'
        value={product?.color?.color}
        hidden
        name={name}
        {...props}
      />
      <div className=''>
        {colors?.length === 0 && (
          <span className={styled.colors__guide}>
            Нажмите Extract color{' '}
            <span
              className={styled.colors__guide_svg}
              onClick={() => {
                if (images?.length === 0) {
                  toast.error(
                    'Нельзя выбрать цвет потомучто нету фоток продукта!'
                  );
                }
                setColorImage(images[0]);
              }}
            >
              <CgColorPicker />
            </span>
            на фото продукта чтобы выбрать цвет
          </span>
        )}
        <ColorExtractor getColors={(colors) => setColors(colors)}>
          <img src={colorImage} style={{ display: 'none' }} alt='' />
        </ColorExtractor>
        <div className={styled.wheel}>{renderSwatches()}</div>
      </div>
    </div>
  );
}
