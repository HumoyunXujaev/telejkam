/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Head from 'next/head';
import NextImage from '@/components/NextImage';
import { getSession } from 'next-auth/react';
import { Button } from '@mui/material';
import { FaTrash } from 'react-icons/fa';

import styled from '@/styles/Profile.module.scss';
import { User } from '@/models/User';
import Layout from '@/components/Profile/Layout';
import { addToCartHandler, priceAfterDiscount } from '@/utils/productUltils';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Popup from '@/components/Popup';
import StyledDotLoader from '@/components/Loaders/DotLoader';
import Link from 'next/link';

export default function Wishlist({ user, tab }) {
  const [products, setProducts] = useState(
    localStorage.getItem('wishlist') || []
  );

  const { cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  console.log(products);
  // remove item from wishlist in local storage

  const removeFromWishlistHandler = (id) => {
    Popup(
      'Are you sure?',
      `This item will be removed from your wishlist.`,
      'question',
      'Yes, remove it!',

      async () => {
        setLoading(true);
        const data = products.filter((product) => product._id !== id);
        setProducts(data);
        localStorage.setItem('wishlist', JSON.stringify(data));
        setLoading(false);
      },
      'Succesfully!',
      'Removed item from wishlist successfully.'
    );
  };

  // const removeFromWishlistHandler = (id) => {
  //   Popup(
  //     'Are you sure?',
  //     `This item will be removed from your wishlist.`,
  //     'question',
  //     'Yes, remove it!',
  //     async () => {
  //       setLoading(true);

  //       const { data } = await axios.patch(`/api/user/wishlist/${id}`);
  //       setProducts(data);
  //       setLoading(false);
  //     },
  //     'Succesfully!',
  //     'Removed item from wishlist successfully.'
  //   );
  // };
  // const qty = products.map((product) =>
  //   product.size
  //     ? product?.subProducts[product?.style]?.sizes[product?.size]?.qty
  //     : product?.subProducts?.map((subproduct) =>
  //         subproduct?.sizes?.map((size) => size?.qty)
  //       )
  // );

  // const discount = products?.map((product) =>
  //   product?.subProducts?.map((subproduct) => subproduct?.discount)
  // );

  // const unitPrice = products?.map((product) =>
  //   product?.size
  //     ? product?.subProducts[product?.style]?.sizes[product?.size]?.price
  //     : product?.subProducts?.map((subproduct) =>
  //         subproduct?.sizes?.map((size) => size?.price)
  //       )
  // );

  // const finalPrice =
  //   discount > 0 ? priceAfterDiscount(unitPrice, discount) : unitPrice;

  // console.log('qty:', qty);
  // console.log('discount:', discount);
  // console.log('unitprice:', unitPrice);
  // console.log('finalprice:', finalPrice);

  return (
    <Layout session={{ name: user.name, image: user.image }} tab={tab}>
      {loading && <StyledDotLoader />}
      <Head>
        <title>Wishlist</title>
      </Head>
      <div className={styled.wishlist}>
        <>
          {products.length > 0 && (
            <div className={styled.header}>
              <h1 className={styled.title}>MY WISHLIST</h1>
            </div>
          )}
          <div className={styled.wishlist__list}>
            {products.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <td>Product</td>
                    <td>Unit price</td>
                    <td>Stock status</td>
                    <td>Добавить в корзину</td>
                  </tr>
                </thead>
                <tbody style={{ position: 'relative' }}>
                  {products.map((product, index) => {
                    // Calculate discount
                    const discount =
                      product?.product?.subProducts?.[product?.style]
                        ?.discount || 0;

                    // Calculate unit price
                    const unitPrice = product?.size
                      ? product?.product?.subProducts[product?.style]?.sizes[
                          product?.size
                        ]?.price
                      : product?.product?.subProducts?.map((subproduct) =>
                          subproduct?.sizes?.map((size) => size?.price)
                        );

                    // Calculate final price after discount
                    const finalPrice =
                      discount > 0
                        ? priceAfterDiscount(unitPrice, discount)
                        : unitPrice;

                    // Calculate quantity
                    const qty = product?.size
                      ? product?.product?.subProducts[product?.style]?.sizes[
                          product?.size
                        ]?.qty
                      : product?.product?.subProducts?.map((subproduct) =>
                          subproduct?.sizes?.map((size) => size?.qty)
                        );

                    console.log('qty:', qty);
                    console.log('discount:', discount);
                    console.log('unitprice:', unitPrice);
                    console.log('finalprice:', finalPrice);

                    return (
                      <tr key={product._id + index}>
                        <td>
                          <div className={styled.wishlist__flex}>
                            <div
                              className={styled.wishlist__products_remove}
                              onClick={() =>
                                removeFromWishlistHandler(product._id)
                              }
                            >
                              <FaTrash />
                            </div>

                            <div className={styled.wishlist__products_images}>
                              <NextImage
                                src={
                                  product?.product?.subProducts[
                                    user?.wishlist[index]?.style
                                  ]?.images[0]?.url
                                }
                                alt={product?.product?.name}
                              />
                            </div>

                            <div className={styled.wishlist__products_infos}>
                              <p>
                                <span>Name : </span>
                                <p>
                                  {product?.product?.name?.substring(0, 30) +
                                    '...'}
                                </p>
                              </p>
                              <p>
                                <span>Style : </span>
                                {product?.product?.subProducts[
                                  user?.wishlist[index]?.style
                                ]?.image ? (
                                  <img
                                    src={
                                      product?.product?.subProducts[
                                        product.style
                                      ]?.color?.image
                                    }
                                    alt=''
                                  />
                                ) : (
                                  <span
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      display: 'inlineBlock',
                                      background:
                                        product?.product?.subProducts[
                                          product?.style
                                        ]?.color?.color,
                                      borderRadius: '50%',
                                    }}
                                  ></span>
                                )}
                              </p>
                              <p>
                                <span>Size : </span>
                                {
                                  product?.product?.subProducts[product?.style]
                                    ?.sizes[product?.size]?.size
                                }
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div
                            className={`${styled.wishlist__flex} ${styled.wishlist__products_price}`}
                          >
                            {discount > 0 ? (
                              <>
                                <span
                                  style={{ textDecoration: 'line-through' }}
                                >
                                  ${unitPrice}
                                </span>
                                <span
                                  className={
                                    styled.wishlist__products_afterPrice
                                  }
                                >
                                  ${finalPrice}
                                </span>
                              </>
                            ) : (
                              <span
                                className={styled.wishlist__products_afterPrice}
                              >
                                ${unitPrice}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{qty > 0 ? 'In stock' : 'Out stock'}</td>
                        <td className={`${styled.btn} ${styled.wishlist__btn}`}>
                          <Button
                            onClick={(e) =>
                              addToCartHandler(
                                e,
                                product?.product._id,
                                product?.style,
                                product?.size,
                                cart,
                                dispatch
                              )
                            }
                            variant='contained'
                          >
                            Добавить в корзину
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className={styled.wishlist__empty}>
                <div className={styled.wishlist__empty_image}>
                  <NextImage src='/images/empty-wishlist-3.webp' />
                </div>
                <p>Your Wishlist is empty!</p>
                <p>Seems like you don&apos;t have wishes here.</p>
                <p>
                  Let&apos;s make a wish at <Link href='/browse'>Browse</Link>{' '}
                  page right now!
                </p>
              </div>
            )}
          </div>
        </>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;

  const tab = query.tab || 2;
  const session = await getSession(ctx);
  const user = await User.findById(session?.user?.id)
    .select('image name wishlist')
    .populate('wishlist.product')
    .lean();

  return {
    props: { user: JSON.parse(JSON.stringify(user)), tab },
  };
}
