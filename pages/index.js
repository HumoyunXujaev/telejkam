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
import FeaturedProducts from '@/components/Home/Main/FeaturedProducts';
import FreeShippingProducts from '@/components/Home/Main/FreeShippingProducts';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Home({
  country,
  products,
  flashDeals,
  featuredProducts,
  freeShippingProducts,
  featuredCategories,
  // featuredBrands,
}) {
  const router = useRouter();

  // console.log('Home -> products', products);
  // console.log('Home -> flashDeals', flashDeals);
  // console.log('Home -> featuredProducts', featuredProducts);
  // console.log('Home -> freeShippingProducts', freeShippingProducts);
  // console.log('Home -> featuredCategories', featuredCategories);
  // // console.log('Home -> featuredBrands', featuredBrands);
  const filter = ({
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
  };

  const searchHandler = (search) => {
    if (search == '') {
      filter({ search: '' });
    } else {
      filter({ search });
    }
  };

  return (
    <>
      <Header country={country} searchHandler={searchHandler} />
      <div className={styled.home}>
        <div className={styled.container}>
          <Main
            flashDeals={flashDeals}
            featuredProducts={featuredProducts}
            freeShippingProducts={freeShippingProducts}
            featuredCategories={featuredCategories}
            // featuredBrands={featuredBrands}
          />

          <AnimateWrapper>
            <AllProducts products={products} />
          </AnimateWrapper>
        </div>
      </div>
      <Footer country={country} />
    </>
  );
}

export async function getStaticProps({ locale }) {
  await db.connectDb();

  //lean method trả về các document dưới dạng plain Object chứ không phải Mongoose document thông thường
  let products = await Product.find()
    .sort({ createdAt: -1 })
    .select('category brand name rating slug subProducts _id shipping')
    .lean();

  let categories = await Category.find().lean();

  const reduceImagesProducts = products.map((p) => {
    const newSubProducts = p.subProducts.map((s) => {
      return { ...s, images: s.images.slice(0, 2) };
    });

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

  // const featuredProducts = await Product.find()
  //   .sort({ rating: -1, "subProducts.sold": -1 })
  //   .lean();

  const featuredProducts = reduceImagesProducts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  const freeShippingProducts = reduceImagesProducts
    .filter((p) => p.shipping === 0)
    .slice(0, 10);

  const featuredCategories = [];

  reduceImagesProducts.forEach((product) => {
    featuredCategories.push(product.category);
  });

  // const featuredBrands = [];

  // console.log(reduceImagesProducts);
  // // function that iterates trough the products and returns the brands
  // reduceImagesProducts.forEach((product) => {
  //   featuredBrands.push(product.brand);
  // });

  let country;
  try {
    let data = await axios.get(
      'https://api.ipregistry.co/?key=ng3oke5gnbj5os01'
    );
    country = data?.data.location?.country;
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
      featuredCategories: JSON.parse(JSON.stringify(categories)),
      country: { name: country.name, flag: country.flag.emojitwo },
      // featuredBrands: JSON.parse(JSON.stringify(featuredBrands)),
    },
  };
}
