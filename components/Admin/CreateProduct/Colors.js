/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

import styled from './styles.module.scss';
import { CgColorPicker } from 'react-icons/cg';
import { ColorExtractor } from 'react-color-extractor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const commonColors = [
  { name: 'Красный', hex: '#FF0000' },
  { name: 'Синий', hex: '#0000FF' },
  { name: 'Зеленый', hex: '#00FF00' },
  { name: 'Желтый', hex: '#FFFF00' },
  { name: 'Черный', hex: '#000000' },
  { name: 'Белый', hex: '#FFFFFF' },
  { name: 'Серый', hex: '#808080' },
  { name: 'Оранжевый', hex: '#FFA500' },
  { name: 'Фиолетовый', hex: '#800080' },
  { name: 'Розовый', hex: '#FFC0CB' },
];

export default function Colors({
  product,
  setProduct,
  name,
  colorImage,
  setColorImage,
  images,
  ...props
}) {
  const [extractedColors, setExtractedColors] = useState([]);

  const handleColorSelection = (color, colorName = '') => {
    setProduct({
      ...product,
      color: {
        color,
        image: product.color.image,
        name: colorName,
      },
    });
    toast.success('Успешно выбран цвет продукта!');
  };

  const renderColorSquares = (colors, isCommon = false) => {
    return colors.map((color, id) => {
      const colorValue = isCommon ? color.hex : color;
      const colorName = isCommon ? color.name : '';
      return (
        <div className={styled.square__color} key={id}>
          <div
            className={styled.square__color_fill}
            style={{ backgroundColor: colorValue }}
            onClick={() => handleColorSelection(colorValue, colorName)}
          ></div>
          <span className='square__color_text' style={{ color: colorValue }}>
            {colorName || colorValue}
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
        {extractedColors.length === 0 && (
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
        <ColorExtractor getColors={(colors) => setExtractedColors(colors)}>
          <img src={colorImage} style={{ display: 'none' }} alt='' />
        </ColorExtractor>
        <div className='color-section'>
          <h3>Цвета из изображения:</h3>
          <div className={styled.wheel}>
            {renderColorSquares(extractedColors)}
          </div>
        </div>
        <div className='color-section'>
          <h3>Распространенные цвета:</h3>
          <div className={styled.wheel}>
            {renderColorSquares(commonColors, true)}
          </div>
        </div>

        {/* <div className={styled.wheel}>{renderSwatches()}</div> */}
      </div>
    </div>
  );
}
