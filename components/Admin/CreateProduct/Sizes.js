import React, { useState } from 'react';
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai';
import styled from './styles.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export default function Sizes({ sizes, product, setProduct }) {
  const [noSize, setNoSize] = useState(false);

  const roundToTwoDecimalPlaces = (value) => {
    return Math.round(value * 100) / 100;
  };

  const changeSizeHandler = (i, e) => {
    const values = [...sizes];
    if (e.target.name === 'price' || e.target.name === 'price_description') {
      values[i][e.target.name] = roundToTwoDecimalPlaces(
        parseFloat(e.target.value)
      );
    } else {
      values[i][e.target.name] = e.target.value;
    }
    setProduct({ ...product, sizes: values });
  };

  const removeHandler = (i) => {
    if (sizes.length > 1) {
      const values = [...sizes];
      values.splice(i, 1);
      setProduct({ ...product, sizes: values });
    }
  };

  return (
    <div className={styled.sizes}>
      <div className={styled.sizes__guide}>
        {noSize ? (
          <span>
            Нажмите{' '}
            <button
              type='button'
              onClick={() => {
                setNoSize(false);
                toast.success(
                  'Продукт имеет размер. Пожалуйста, введите размер, количество и цену'
                );
              }}
            >
              здесь
            </button>{' '}
            если продукт имеет размер
          </span>
        ) : (
          <span>
            Нажмите{' '}
            <button
              type='button'
              onClick={() => {
                setNoSize(true);

                let data = [sizes[0]].map((item) => ({
                  qty: item.qty,
                  price: item.price,
                  price_description: item.price_description,
                }));

                setProduct({ ...product, sizes: data });

                toast.success(
                  'Продукт не имеет размера. Пожалуйста, введите количество и цену'
                );
              }}
            >
              здесь
            </button>{' '}
            если продукт не имеет размера
          </span>
        )}
      </div>

      {sizes
        ? sizes.map((size, i) => (
            <div className={styled.sizes__row} key={i}>
              {!noSize ? (
                <div className={styled.sizes__row_actions}>
                  <div
                    className={styled.sizes__row_action}
                    onClick={() =>
                      setProduct({
                        ...product,
                        sizes: [
                          ...sizes,
                          {
                            size: '',
                            qty: '',
                            price: '',
                            price_description: '',
                          },
                        ],
                      })
                    }
                  >
                    <AiOutlinePlusSquare /> Добавить еще
                  </div>
                  <div
                    className={styled.sizes__row_action2}
                    onClick={() => removeHandler(i)}
                  >
                    <AiOutlineMinusSquare />
                    Удалить
                  </div>
                </div>
              ) : (
                ''
              )}
              <div
                className={`${styled.clickToAdd} ${
                  noSize && styled.clickToAdd2
                } selectInput`}
              >
                {!noSize && (
                  <input
                  type='text'
                  name='size'
                  placeholder='Введите размер'
                  value={size.size}
                  onChange={(e) => changeSizeHandler(i, e)}
                />
                )}
                <input
                  type='number'
                  name='qty'
                  placeholder={
                    noSize ? 'Количество продукта' : 'Количество размера'
                  }
                  min={0}
                  value={size.qty}
                  onChange={(e) => changeSizeHandler(i, e)}
                />
                <input
                  type='number'
                  name='price'
                  placeholder={noSize ? 'Цена продукта(рассрочка)' : 'Цена размера'}
                  min={1}
                  value={size.price}
                  onChange={(e) => changeSizeHandler(i, e)}
                  step='0.01'
                />
                <input
                  type='number'
                  name='price_description'
                  placeholder={
                    noSize ? 'Общая цена продукта(наличкой)' : 'Общая цена размера'
                  }
                  min={1}
                  value={size.price_description}
                  onChange={(e) => changeSizeHandler(i, e)}
                  step='0.01'
                />
              </div>
            </div>
          ))
        : ''}
    </div>
  );
}
