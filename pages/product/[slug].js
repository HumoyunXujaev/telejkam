'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from '@/styles/Product.module.scss';

import axios from 'axios';
import { toast } from 'react-toastify';

import SimilarSwiper from '@/components/ProductPageContent/SimilarSwiper';
import CartHeader from '@/components/Cart/Header';
import Footer from '@/components/Footer';
import BreadCrumb from '@/components/BreadCrumb';
import MainSwiper from '@/components/ProductPageContent/MainSwiper';
import Infos from '@/components/ProductPageContent/Infos';
import Payment from '@/components/ProductPageContent/Payment';

import db from '@/utils/db';
import {
  calculatePercentage,
  findAllSizes,
  priceAfterDiscount,
  sortPricesArr,
} from '@/utils/productUltils';
import { useTranslation } from 'next-i18next';

import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { SubCategory } from '@/models/SubCategory';
import Header from '@/components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProductCard from '@/components/ProductCard';

const ProductPage = ({ product }) => {
  const { t } = useTranslation();

  const [activeImg, setActiveImg] = useState('');
  const [images, setImages] = useState(product?.images);
  const [ratings, setRatings] = useState([]);
  const [loadRatings, setLoadRatings] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoadRatings(true);
      const { data } = await axios.get(`/api/product/${product._id}/review`);
      setRatings([
        { percentage: calculatePercentage(data, 5) },
        { percentage: calculatePercentage(data, 4) },
        { percentage: calculatePercentage(data, 3) },
        { percentage: calculatePercentage(data, 2) },
        { percentage: calculatePercentage(data, 1) },
      ]);
      setLoadRatings(false);
    };

    try {
      fetchRatings();
    } catch (error) {
      setLoadRatings(false);
      toast.error(error.response.data.message);
    }
  }, [product?._id]);

  useEffect(() => {
    let recentIds = JSON.parse(localStorage.getItem('recent-ids')) || [];
    recentIds.unshift(product._id.toString());
    const uniqueRecentIds = [...new Set(recentIds)];
    localStorage.setItem('recent-ids', JSON.stringify(uniqueRecentIds));
  }, [product?._id]);

  return (
    <div>
      <Head>
        <title>{product.name}</title>
        <meta name='description' content={product?.description} />
      </Head>
      {/* <Header /> */}
      <CartHeader
        text={t('return_to_products')}
        link='/browse'
        link2='/cart'
        text2={t('header.cart')}
      />
      <div className={styled.product}>
        <div className={styled.container}>
          {/* BreadCrumb */}
          <BreadCrumb
            category={product?.category?.name}
            categoryLink={'/browse'}
            subCategories={product?.subCategories}
          />

          <main className={styled.product__main}>
            <div className={styled.product__main_column}>
              {/* Product Content: Main image */}
              <MainSwiper images={images} activeImg={activeImg} />
              <Payment />
            </div>

            {/* Product Content: Infos */}
            <Infos
              product={product}
              setActiveImg={setActiveImg}
              setImages={setImages}
            />
          </main>
          <br />
          <br />

          <SimilarSwiper product={product} />
          {/* <Reviews
            product={product}
            ratings={ratings}
            loadRatings={loadRatings}
          /> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;

export async function getServerSideProps(context) {
  const { query } = context;
  const { locale } = context;

  const slug = query.slug;
  const style = query.style;
  const size = query.size || 0;

  await db.connectDb();
  let product = await Product.findOne({ slug })
    //path là property category cần điền thông tin
    .populate({ path: 'category', model: Category })
    .populate({ path: 'subCategories', model: SubCategory })
    .lean();

  let subProduct = product?.subProducts[style];

  let prices = sortPricesArr(subProduct?.sizes);

  let newProduct = {
    ...product,
    style,
    images: subProduct?.images,
    sizes: subProduct?.sizes,
    discount: subProduct?.discount,
    sku: subProduct?.sku,
    colors: product?.subProducts?.map((p) => {
      if (p?.color?.image && p?.color?.color) {
        return { colorImg: p?.color?.image, color: p?.color?.color };
      } else {
        return { color: p?.color?.color };
      }
    }),

    priceRange: subProduct?.discount
      ? `$${priceAfterDiscount(
          prices[0],
          subProduct?.discount
        )} ~ $${priceAfterDiscount(
          prices?.[prices?.length - 1],
          subProduct?.discount
        )}`
      : `$${prices?.[0]} ~ $${prices?.[prices?.length - 1]}`,

    price:
      subProduct?.discount > 0
        ? priceAfterDiscount(
            subProduct?.sizes[size]?.price_description,
            subProduct?.discount
          )
        : subProduct?.sizes[size]?.price_description,
    priceBefore: subProduct?.sizes[size]?.price_description,
    quantity: subProduct?.sizes[size]?.qty,
    allSizes: findAllSizes(product?.subProducts),
  };

  console.log(subProduct?.sizes[size]?.price_description);
  await db.disConnectDb();

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      product: JSON.parse(JSON.stringify(newProduct)),
    },
  };
}
