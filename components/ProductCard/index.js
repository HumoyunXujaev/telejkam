/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MdDiscount } from 'react-icons/md';

import ProductCardSwiper from './ProductCardSwiper';

import styled from './styles.module.scss';
import { priceAfterDiscount, sortPricesArr } from '@/utils/productUltils';
// import Ratings from '../Ratings';
import Actions from '../Actions';
import Router from 'next/router';

const ProductCard = ({ product, className, remove }) => {
  const [active, setActive] = useState(0);
  const [sizeActive, setSizeActive] = useState(0);
  const [showActions, setShowActions] = useState(false);

  const [images, setImages] = useState(product.subProducts[active]?.images);

  const [styles, setStyles] = useState(
    product.subProducts.map((p) => {
      return p.color;
    })
  );

  let prices = sortPricesArr(product.subProducts[active]?.sizes);

  const priceFrom = product.subProducts[active]?.discount
    ? priceAfterDiscount(prices[0], product.subProducts[active].discount)
    : prices?.[0];

  //Active subProduct thay đổi, cập nhật lại state ảnh và giá
  useEffect(() => {
    setImages(product.subProducts[active]?.images);
  }, [active]);

  return (
    <div className={`${styled.product} ${className}`}>
      <div className={styled.product__container}>
        <Link
          href={`/product/${product.slug}?style=${active}&size=${sizeActive}`}
        >
          <div
            style={{ position: 'relative' }}
            onMouseOver={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
          >
            <ProductCardSwiper images={images} />
            <div
              className={styled.product__infos_actions}
              style={{
                transform: showActions ? 'scale3d(1,1,1)' : 'scale3d(1,0,1)',
              }}
            >
              <Actions
                product={product}
                productStyle={active}
                productSize={sizeActive}
              />
            </div>{' '}
            {product.subProducts[active]?.discount ? (
              <div className={styled.product__infos_discount}>
                <MdDiscount />
                <p>{product.subProducts[active].discount}%</p>
              </div>
            ) : (
              ''
            )}
            {product.label && (
              <div className={styled.product__infos_label}>
                <MdDiscount />
                <p>{product.label}</p>
              </div>
            )}
          </div>

          <div className={styled.product__infos}>
            <div className={styled.product__infos_colors}>
              {styles &&
                styles.map((style, index) =>
                  style?.image ? (
                    <img
                      key={index}
                      className={index === active && styled.active}
                      onMouseOver={() => {
                        setImages(product.subProducts[index]?.images);
                        setActive(index);
                      }}
                      src={style.image}
                      alt=''
                    />
                  ) : (
                    <span
                      key={index}
                      style={{
                        backgroundColor: `${style?.color}`,
                        outlineOffset: '2px',
                        cursor: 'pointer',
                      }}
                      className={index === active && styled.active}
                      onMouseOver={() => {
                        setImages(product.subProducts[index]?.images);
                        setActive(index);
                      }}
                    ></span>
                  )
                )}
            </div>

            <div className={styled.product__infos_sizes}>
              {product.subProducts[active]?.sizes.map((size, i) => {
                return (
                  size.size && (
                    <div key={i}>
                      <button
                        onClick={() => setSizeActive(i)}
                        className={sizeActive === i && styled.sizeActive}
                        htmlFor='size'
                      >
                        {size.size && size.size}
                      </button>
                    </div>
                  )
                );
              })}
            </div>

            <h4 className={styled.product__infos_name}>{product.name}</h4>

            <div className={styled.product__infos_flex}>
              <div className={styled.product__infos_price}>
                <span></span>
                <span></span>
                <span>{priceFrom} сум/мес</span>
                {product.subProducts[active]?.discount > 0 && (
                  <>
                    <span></span>
                    <span>{prices[0]}</span>
                  </>
                )}
              </div>

              {/* <div className={styled.product__infos_ratings}>
                <Ratings value={product.rating} />
              </div> */}
            </div>
          </div>
        </Link>
        {Router.pathname === '/wishlist' && (
          <button
            onClick={() => remove(product._id)}
            className={styled.product__infos_remove}
            style={{
              width: '100%',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Remove from wishlist
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
