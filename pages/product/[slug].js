'use client';
/* eslint-disable @next/next/no-img-element */

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
import { useRouter } from 'next/navigation';

const ProductPage = ({ product: initialProduct }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [activeImg, setActiveImg] = useState('');
  const [images, setImages] = useState(product?.images);

  useEffect(() => {
    let recentIds = JSON.parse(localStorage.getItem('recent-ids')) || [];
    recentIds.unshift(product?._id?.toString());
    const uniqueRecentIds = [...new Set(recentIds)];
    localStorage.setItem('recent-ids', JSON.stringify(uniqueRecentIds));
  }, [product?._id]);

  useEffect(() => {
    if (router.isReady) {
      const { style, size } = router.query;

      if (style !== undefined || size !== undefined) {
        // Create updated product with selected style/size
        const selectedStyle = style || 0;
        const selectedSize = size || 0;
        const subProduct = initialProduct.subProducts[selectedStyle];
        const prices = sortPricesArr(subProduct?.sizes);

        setProduct({
          ...initialProduct,
          style: selectedStyle,
          images: subProduct?.images,
          sizes: subProduct?.sizes,
          discount: subProduct?.discount,
          sku: subProduct?.sku,
          // ... other calculations
          price:
            subProduct?.discount > 0
              ? priceAfterDiscount(
                  subProduct?.sizes[selectedSize]?.price_description,
                  subProduct?.discount
                )
              : subProduct?.sizes[selectedSize]?.price_description,
          priceBefore: subProduct?.sizes[selectedSize]?.price_description,
          quantity: subProduct?.sizes[selectedSize]?.qty,
        });
      }
    }
  }, [router.isReady, router.query]);

  return (
    <div>
      <Head>
        <title>{product?.name}</title>
        <meta name='description' content={product?.description} />
      </Head>
      {/* <Header /> */}
      {/* <CartHeader
        text={t('return_to_products')}
        link='/browse'
        link2='/cart'
        text2={t('header.cart')}
      /> */}
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
        </div>
      </div>
      {/* <Footer /> */}
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
    // colors: product?.subProducts?.map((p) => {
    //   if (p?.color?.image && p?.color?.color) {
    //     return { colorImg: p?.color?.image, color: p?.color?.color };
    //   } else {
    //     return { color: p?.color?.color };
    //   }
    // }),

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

// export async function getStaticPaths() {
//   await db.connectDb();

//   // Get all product slugs for pre-rendering
//   const products = await Product.find({}).select('slug').lean();
//   const paths = products.map((product) => ({
//     params: { slug: product.slug },
//   }));

//   await db.disConnectDb();

//   return {
//     paths,
//     // "blocking" means pages not generated at build time will be generated on first request
//     fallback: 'blocking',
//   };
// }

// export async function getStaticProps({ params, locale }) {
//   const slug = params.slug;

//   // Default values for style and size (will be overridden client-side based on query params)
//   const style = 0;
//   const size = 0;

//   await db.connectDb();
//   let product = await Product.findOne({ slug })
//     .populate({ path: 'category', model: Category })
//     .populate({ path: 'subCategories', model: SubCategory })
//     .lean();

//   // Handle case where product doesn't exist
//   if (!product) {
//     return {
//       notFound: true,
//     };
//   }

//   // Process product data with default style and size
//   let subProduct = product?.subProducts[style];
//   let prices = sortPricesArr(subProduct?.sizes);
//   let newProduct = {
//     ...product,
//     style,
//     images: subProduct?.images,
//     sizes: subProduct?.sizes,
//     discount: subProduct?.discount,
//     sku: subProduct?.sku,
//     priceRange: subProduct?.discount
//       ? `$${priceAfterDiscount(
//           prices[0],
//           subProduct?.discount
//         )} ~ $${priceAfterDiscount(
//           prices?.[prices?.length - 1],
//           subProduct?.discount
//         )}`
//       : `$${prices?.[0]} ~ $${prices?.[prices?.length - 1]}`,
//     price:
//       subProduct?.discount > 0
//         ? priceAfterDiscount(
//             subProduct?.sizes[size]?.price_description,
//             subProduct?.discount
//           )
//         : subProduct?.sizes[size]?.price_description,
//     priceBefore: subProduct?.sizes[size]?.price_description,
//     quantity: subProduct?.sizes[size]?.qty,
//     allSizes: findAllSizes(product?.subProducts),
//   };

//   await db.disConnectDb();

//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//       product: JSON.parse(JSON.stringify(newProduct)),
//     },
//     // Revalidate every hour
//     revalidate: 1200,
//   };
// }
