import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Main from '@/components/Home/Main';
import { Product } from '@/models/Product';
import db from '@/utils/db';
import { Category } from '@/models/Category';
import styled from '../styles/Home.module.scss';
import AllProducts from '@/components/Home/AllProducts';
import AnimateWrapper from '@/components/AnimateWrapper';
import axios from 'axios';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useCallback } from 'react';
const MemoizedHeader = React.memo(Header);
const MemoizedAllProducts = React.memo(AllProducts);

export default function Home({
  country,
  products,
  flashDeals,
  featuredProducts,
  freeShippingProducts,
  featuredCategories,
}) {
  const router = useRouter();

  const filter = useCallback(
    ({
      search,
      category,
      brand,
      style,
      pattern,
      material,
      size,
      color,
      gender,
      price,
      shipping,
      rating,
      sort,
      page,
    }) => {
      const path = router.pathname;
      if (search) router.query.search = search;
      if (category) router.query.category = category;
      if (brand) router.query.brand = brand;
      if (style) router.query.style = style;
      if (pattern) router.query.pattern = pattern;
      if (material) router.query.material = material;
      if (size) router.query.size = size;
      if (color) router.query.color = color;
      if (gender) router.query.gender = gender;
      if (price) router.query.price = price;
      if (shipping) router.query.shipping = shipping;
      if (rating) router.query.rating = rating;
      if (sort) router.query.sort = sort;
      if (page) router.query.page = page;

      router.push({ pathname: path, query: router.query }, undefined, {
        scroll: false,
      });
    },
    [router]
  );

  const searchHandler = useCallback(
    (search) => {
      if (search === '') {
        filter({ search: '' });
      } else {
        filter({ search });
      }
    },
    [filter]
  );

  return (
    <>
      <MemoizedHeader country={country} searchHandler={searchHandler} />
      <div className={styled.home}>
        <div className={styled.container}>
          <Main
            flashDeals={flashDeals}
            featuredProducts={featuredProducts}
            freeShippingProducts={freeShippingProducts}
            featuredCategories={featuredCategories}
          />
          <AnimateWrapper>
            <MemoizedAllProducts products={products} />
          </AnimateWrapper>
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getStaticProps({ locale }) {
  await db.connectDb();

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

  const featuredCategories = categories.map((category) => ({
    name: category.name,
    slug: category.slug,
  }));

  let country = { name: '', flag: '' };
  try {
    const { data } = await axios.get(
      'https://api.ipregistry.co/?key=ng3oke5gnbj5os01'
    );
    country = data?.location?.country || { name: '', flag: '' };
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      products: JSON.parse(JSON.stringify(reduceImagesProducts)),
      flashDeals: JSON.parse(JSON.stringify(flashDealsArray)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      freeShippingProducts: JSON.parse(JSON.stringify(freeShippingProducts)),
      featuredCategories: JSON.parse(JSON.stringify(featuredCategories)),
      country,
    },
    revalidate: 60,
  };
}
