import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Main from '@/components/Home/Main';
import { Product } from '@/models/Product';
import db from '@/utils/db';
import { Settings } from '@/models/Settings';
import { Category } from '@/models/Category';
import styled from '../styles/Home.module.scss';
import AllProducts from '@/components/Home/AllProducts';
import AnimateWrapper from '@/components/AnimateWrapper';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useCallback, useEffect } from 'react';
import { se } from 'date-fns/locale';
import axios from 'axios';
const MemoizedHeader = React.memo(Header);
const MemoizedAllProducts = React.memo(AllProducts);

export default function Home({
  country,
  products,
  flashDeals,
  featuredProducts,
  freeShippingProducts,
  featuredCategories,
  settings,
}) {
  const router = useRouter();

  // SET THE PRODUCTS TO THE SESSION STORAGE
  useEffect(() => {
    const fetchData = async () => {
      products.forEach(async (product) => {
        const response = await axios.get(
          `/api/product/${product._id}?style=0&size=0`
        );
        // set response.data to session storage as products
        sessionStorage.setItem(product._id, JSON.stringify(response.data));

        console.log('response', response);
      });
    };

    fetchData();
  }, []);

  return (
    <>
      {/* <MemoizedHeader country={country} searchHandler={searchHandler} /> */}
      <div className={styled.home}>
        <div className={styled.container}>
          <Main
            flashDeals={flashDeals}
            featuredProducts={featuredProducts}
            freeShippingProducts={freeShippingProducts}
            featuredCategories={featuredCategories}
            heroImages={settings?.heroImages || []}
            settings={settings}
          />
          <AnimateWrapper>
            <MemoizedAllProducts products={products} />
          </AnimateWrapper>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export async function getStaticProps({ locale }) {
  await db.connectDb();
  const settings = await Settings.findOne({}).lean();
  let products = await Product.find()
    .sort({ createdAt: -1 })
    .select('category brand name rating slug subProducts _id shipping')
    .lean();

  let categories = await Category.find().lean();

  const reduceImagesProducts = products.map((p) => {
    const newSubProducts = p.subProducts.map((s) => ({
      ...s,
      images: s.images.slice(0, 2),
    }));
    return { ...p, subProducts: newSubProducts };
  });

  const leanProducts = reduceImagesProducts.map((p) => ({
    parentId: p._id,
    name: p.name,
    slug: p.slug,
    subProducts: p.subProducts,
  }));

  const flashDealsArray = [];
  leanProducts.forEach((p) => {
    for (let i = 0; i < p.subProducts.length; i++) {
      if (p.subProducts[i].discount > 0) {
        const childProduct = {
          name: p.name,
          slug: `${p.slug}?style=${i}`,
          ...p.subProducts[i],
          parentId: p.parentId,
          style: i,
        };
        flashDealsArray.push(childProduct);
      }
    }
  });

  const featuredProducts = reduceImagesProducts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  const freeShippingProducts = reduceImagesProducts
    .filter((p) => p.shipping === 0)
    .slice(0, 10);

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      products: JSON.parse(JSON.stringify(reduceImagesProducts)),
      flashDeals: JSON.parse(JSON.stringify(flashDealsArray)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      freeShippingProducts: JSON.parse(JSON.stringify(freeShippingProducts)),
      featuredCategories: JSON.parse(JSON.stringify(categories)),
      settings: JSON.parse(
        JSON.stringify(
          settings || {
            heroImages: [],
            contacts: {
              phone: '',
              address: '',
              telegram: '',
              instagram: '',
              location: '',
            },
          }
        )
      ),
    },
    revalidate: 60,
  };
}
