/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import NextImage from '@/components/NextImage';

import { addToCartHandler, priceAfterDiscount } from '@/utils/productUltils';
import { useTranslation } from 'next-i18next';
import * as Icon from 'react-feather';

import styled from './styles.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FlashCard = ({ product }) => {
  const { cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [sizeActive, setSizeActive] = useState(0);
  const [productDataCache, setProductDataCache] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `/api/product/${product.parentId}?style=${active}&size=${sizeActive}`
      );
      setProductDataCache({
        ...productDataCache,
        [`${product._id}_${active}_${sizeActive}`]: response.data,
      });
    };

    fetchData();
  }, [product, active, sizeActive]);

  return (
    <div className={styled.flashDeals__item}>
      <Link href={`/product/${product.slug}`}>
        <div className={styled.flashDeals__item_img}>
          <NextImage src={product.images[0].url} alt='' />
        </div>

        <div className={styled.flashDeals__item_infos}>
          <div
            className={styled.flex}
            style={{ justifyContent: 'space-between' }}
          >
            <div className={styled.flashDeals__item_discount}>
              <span>
                {product.discount}% {t('discount')}
              </span>
              <span>{t('deal')}</span>
            </div>
          </div>

          <h5 className={styled.flashDeals__item_name}>{product.name}</h5>

          <div className={styled.flashDeals__item_price}>
            <span></span>
            <span>
              {priceAfterDiscount(
                product.sizes[0].price_description,
                product.discount
              ).toLocaleString('ru-RU')}{' '}
              {t('price_def')}
            </span>
            <br />
            <span>{t('price')} </span>
            <span></span>
            <span>
              {product.sizes[0].price_description.toLocaleString('ru-RU')}
            </span>
          </div>

          <button
            className={styled.flashDeals__item_btn}
            onClick={(e) =>
              addToCartHandler(
                e,
                product.parentId,
                product.style,
                0,
                cart,
                dispatch,
                productDataCache,
                setProductDataCache
              )
            }
          >
            <span>
              <Icon.ShoppingCart />
            </span>
            <span>{t('add_to_cart')}</span>
          </button>
        </div>
      </Link>
    </div>
  );
};

export default FlashCard;
