import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Drawer, IconButton, Pagination } from '@mui/material';

import styled from '@/styles/Browse.module.scss';
import db from '@/utils/db';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { SubCategory } from '@/models/SubCategory';
import { filterArray, randomize, removeDuplicates } from '@/utils/arrayUltils';
import Header from '@/components/Header';
import BreadCrumb from '@/components/BreadCrumb';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';
import { useMediaQuery } from 'react-responsive';
import { calculateFiltersApplied } from '@/utils/objectUltils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import * as Icon from 'react-feather';
const AnimateWrapper = dynamic(() => import('@/components/AnimateWrapper'), {
  suspense: true,
});
import NextImage from '@/components/NextImage';
import HeadingFilters from '@/components/Browse/HeadingFilters';
import SortFilter from '@/components/Browse/PriceFilter';
import BrandsFilter from '@/components/Browse/BrandsFilter';
import CategoryFilter from '@/components/Browse/CategoryFilter';
import ProductCard from '@/components/ProductCard';

export default function BrowsePage({
  categories,
  products,
  subCategories,
  sizes,
  // colors,
  brands,
  styles,
  paginationCount,
}) {
  const router = useRouter();

  const isMedium = useMediaQuery({ query: '(max-width: 1023px)' });
  const isLarge = useMediaQuery({ query: '(min-width: 1024px)' });
  const isSmall = useMediaQuery({ query: '(max-width: 950px)' });
  const sortQuery = router.query.sort || '';
  const [show, setShow] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [sortdrawer, setSortDrawer] = useState(false);

  const filter = ({
    search,
    category,
    brand,
    style,
    pattern,
    material,
    size,
    // color,
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
    // if (color) router.query.color = color;
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

  const categoryHandler = (category) => {
    filter({ category });
  };

  const brandHandler = (brand) => {
    filter({ brand });
  };

  const patternHandler = (pattern) => {
    filter({ pattern });
  };

  const styleHandler = (style) => {
    filter({ style });
  };

  const materialHandler = (material) => {
    filter({ material });
  };

  const sizeHandler = (size) => {
    filter({ size });
  };

  // const colorHandler = (color) => {
  //   filter({ color });
  // };

  const genderHandler = (gender) => {
    filter({ gender });
  };

  const priceHandler = (price, type) => {
    let priceQuery = router.query.price?.split('_') || '';
    let min = priceQuery[0] || '';
    let max = priceQuery[1] || '';

    let newPrice = '';

    if (type === 'min') {
      newPrice = `${price}_${max}`;
    }

    if (type === 'max') {
      newPrice = `${min}_${price}`;
    }

    //Nếu chỉ nhập mỗi min, query có dạng price=min_
    //Nếu chỉ nhập mỗi max, query có dang price=_max

    filter({ price: newPrice });
  };

  const shippingHandler = (shipping) => {
    filter({ shipping });
  };

  const ratingHandler = (rating) => {
    filter({ rating });
  };

  const sortHandler = (sort) => {
    filter({ sort });
  };

  const pageHandler = (e, page) => {
    filter({ page });
  };

  const multiPriceHandler = (min, max) => {
    filter({ price: `${min}_${max}` });
  };

  const checkChecked = (queryName, value) => {
    //Sử dụng search method với đối số là value
    if (router.query[queryName]?.includes(value)) {
      return true;
    }

    return false;
  };

  const { t } = useTranslation();

  return (
    <div className={styled.browse}>
      {/* <Header searchHandler={searchHandler} /> */}
      <div className={styled.browse__container}>
        <AnimateWrapper>
          <div className={styled.browse__path}>
            <BreadCrumb
              category={'Каталог'}
              categoryLink='/browse'
              subCategories={[]}
            />
          </div>

          <div className={styled.browse__tags}>
            {categories.map((c) => (
              <Link
                className={
                  router.query.category?.includes(c._id) && styled.activeTag
                }
                href={`/browse?category=${c._id}`}
                key={c._id}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </AnimateWrapper>

        <div className={styled.browse__store}>
          <AnimateWrapper origin='left'>
            {/* on mobile devices show an icon to open a drawer */}
            {isSmall && (
              <div className={styled.browse__drawerIcon}>
                <div className={styled.browse__drawerIcon_item}>
                  <IconButton onClick={() => setDrawerOpen(true)}>
                    Фильтры <Icon.Filter />
                  </IconButton>
                </div>
                <div className={styled.browse__drawerIcon_item}>
                  <IconButton onClick={() => setSortDrawer(true)}>
                    Сортировать <Icon.Filter />
                  </IconButton>
                </div>

                {/* drawer for sort */}
                <Drawer
                  anchor='top'
                  open={sortdrawer}
                  onClose={() => setSortDrawer(false)}
                >
                  <div className={styled.browse__drawer}>
                    <IconButton onClick={() => setSortDrawer(false)}>
                      <Icon.XCircle />
                    </IconButton>
                    <SortFilter
                      sortHandler={sortHandler}
                      sortQuery={sortQuery}
                      sortingOptions={sortingOptions}
                    />
                  </div>
                </Drawer>

                <Drawer
                  anchor='top'
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                >
                  <div className={styled.browse__drawer}>
                    <IconButton onClick={() => setDrawerOpen(false)}>
                      <Icon.XCircle />
                    </IconButton>
                    <SortFilter
                      sortHandler={sortHandler}
                      sortQuery={sortQuery}
                      sortingOptions={sortingOptions}
                    />

                    <CategoryFilter
                      categories={categories}
                      subCategories={subCategories}
                      categoryHandler={categoryHandler}
                      checkChecked={checkChecked}
                    />

                    {/* <ColorsFilter
                      colors={colors}
                      colorHandler={colorHandler}
                      checkChecked={checkChecked}
                    /> */}

                    <BrandsFilter
                      brands={brands}
                      brandHandler={brandHandler}
                      checkChecked={checkChecked}
                    />
                  </div>
                </Drawer>
              </div>
            )}
            <div
              className={`${styled.browse__store_filters} ${styled.scrollbar}`}
            >
              <div className={styled.browse__clearBtn}>
                <Button
                  variant='contained'
                  onClick={() => router.push('/browse')}
                >
                  {t('clear_all')} ({calculateFiltersApplied(router.query)})
                </Button>
              </div>

              {/* <div className={styled.filters__sort}>
                <span>Sort by :</span>
                <div
                  className={styled.filters__sort_list}
                  onMouseOver={() => setShow(true)}
                  onMouseLeave={() => setShow(false)}
                >
                  <button>
                    {sortQuery == ''
                      ? 'Recommend'
                      : sortingOptions.find((x) => x.value === sortQuery).name}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        transform: `${show ? 'rotate(180deg)' : 'rotate(0)'}`,
                      }}
                    >
                      <IoIosArrowDown />
                    </div>
                  </button>

                  <ul
                    style={{
                      transform: `${
                        show ? 'scale3d(1,1,1)' : 'scale3d(1,0,1)'
                      }`,
                    }}
                  >
                    {sortingOptions.map((option, i) => (
                      <li key={i} onClick={() => sortHandler(option.value)}>
                        <a>
                          {sortQuery === option.value ? (
                            <b>{option.name}</b>
                          ) : (
                            option.name
                          )}
                          {sortQuery === option.value ? <FcCheckmark /> : ''}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div> */}
              {/* </div> */}

              <SortFilter
                sortHandler={sortHandler}
                sortQuery={sortQuery}
                sortingOptions={sortingOptions}
              />
              <CategoryFilter
                categories={categories}
                subCategories={subCategories}
                categoryHandler={categoryHandler}
                checkChecked={checkChecked}
              />

              {/* <SizesFilter
                sizes={sizes}
                sizeHandler={sizeHandler}
                checkChecked={checkChecked}
              /> */}

              {/* <ColorsFilter
                colors={colors}
                colorHandler={colorHandler}
                checkChecked={checkChecked}
              /> */}

              <BrandsFilter
                brands={brands}
                brandHandler={brandHandler}
                checkChecked={checkChecked}
              />

              {/* <StylesFilter
                styles={styles}
                styleHandler={styleHandler}
                checkChecked={checkChecked}
              />

             

            

              <StarsFilter
                checkChecked={checkChecked}
                ratingHandler={ratingHandler}
              /> */}

              {/* <ShippingFeeFilter
                checkChecked={checkChecked}
                shippingHandler={shippingHandler}
              /> */}
            </div>
          </AnimateWrapper>

          <div className={styled.browse__store_products_wrap}>
            <AnimateWrapper>
              <HeadingFilters
                priceHandler={priceHandler}
                multiPriceHandler={multiPriceHandler}
              />
            </AnimateWrapper>

            <div className={styled.browse__store_products}>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <AnimateWrapper delay={50 * index} key={product._id}>
                    <ProductCard
                      product={product}
                      className={
                        isLarge ? 'grid__4' : isMedium ? 'grid__3' : 'grid__2'
                      }
                    />
                  </AnimateWrapper>
                ))
              ) : (
                <div className={styled.browse__store_empty}>
                  <NextImage src={'/images/empty-search.jpg'} />
                </div>
              )}
            </div>
            {products.length > 0 && paginationCount > 1 && (
              <div className={styled.pagination}>
                <Pagination
                  count={paginationCount}
                  defaultPage={Number(router.query.page) || 1}
                  onChange={pageHandler}
                  shape='rounded'
                  color='primary'
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { locale } = ctx;
  await db.connectDb();
  const searchQuery = ctx.query.search || '';
  const categoryQuery = ctx.query.category || '';
  const priceQuery = ctx.query.price?.split('_');
  const shippingQuery = ctx.query.shipping || 0;
  const ratingQuery = ctx.query.rating || '';
  const sortQuery = ctx.query.sort || '';
  const pageQuery = ctx.query.page || 1;
  const pageSize = 10;

  //------------------
  function createRegex(data, styleRegex) {
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        styleRegex += `|^${data[i]}`;
      }
    }
    return styleRegex;
  }
  //------------------

  const brandQuery = ctx.query.brand?.split('_') || '';
  const brandRegex = `^${brandQuery[0]}`;
  const brandMultiRegex = createRegex(brandQuery, brandRegex);

  const styleQuery = ctx.query.style?.split('_') || '';
  const styleRegex = `^${styleQuery[0]}`;
  const styledMultiRegex = createRegex(styleQuery, styleRegex);

  const sizeQuery = ctx.query.size?.split('_') || '';
  const sizeRegex = `^${sizeQuery[0]}`;
  const sizeMultiRegex = createRegex(sizeQuery, sizeRegex);

  // const colorQuery = ctx.query.color?.split('_') || '';
  // const colorRegex = `^${colorQuery[0]}`;
  // const colorMultiRegex = createRegex(colorQuery, colorRegex);

  //------------------

  const searchOptions =
    searchQuery && searchQuery.trim().length > 0
      ? { name: { $regex: searchQuery, $options: 'i' } }
      : {};

  const categoryOptions =
    categoryQuery && categoryQuery.trim().length > 0
      ? { category: categoryQuery }
      : {};

  const brandOptions =
    brandQuery && brandQuery.length > 0
      ? { brand: { $regex: brandMultiRegex, $options: 'i' } }
      : {};

  const styleOptions =
    styleQuery && styleQuery.length > 0
      ? { 'details.value': { $regex: styledMultiRegex, $options: 'i' } }
      : {};

  const sizeOptions =
    sizeQuery && sizeQuery.length > 0
      ? { 'subProducts.sizes.size': { $regex: sizeMultiRegex, $options: 'i' } }
      : {};

  // const colorOptions =
  //   colorQuery && colorQuery.length > 0
  //     ? {
  //         'subProducts.color.color': { $regex: colorMultiRegex, $options: 'i' },
  //       }
  //     : {};

  const priceOptions =
    priceQuery && priceQuery.length > 0
      ? {
          'subProducts.sizes.price': {
            //GTE là Minimum//LTE là Maximum
            $gte: Number(priceQuery[0]) || 0,
            $lte: Number(priceQuery[1]) || Infinity,
          },
        }
      : {};

  let shippingOptions = {};
  if (shippingQuery) {
    if (shippingQuery == 'Free') {
      shippingOptions = { shipping: 0 };
    } else if (shippingQuery == 'Charged') {
      shippingOptions = { shipping: { $gt: 0 } };
    }
  }

  let ratingOptions = {};
  if (ratingQuery) {
    if (ratingQuery == '3') {
      ratingOptions = { rating: { $gte: 3 } };
    } else if (ratingQuery == '4') {
      ratingOptions = { rating: { $gte: 4 } };
    } else if (ratingQuery == '5') {
      ratingOptions = { rating: 5 };
    }
  }

  const sortOptions =
    sortQuery == 'recommend'
      ? {}
      : sortQuery == 'popular'
      ? { rating: -1, 'subProducts.sold': -1 }
      : sortQuery == 'newest'
      ? { createdAt: -1 }
      : sortQuery == 'topSelling'
      ? { 'subProducts.sold': -1 }
      : sortQuery == 'priceHighToLow'
      ? { 'subProducts.sizes.price': -1 }
      : sortQuery == 'priceLowToHigh'
      ? { 'subProducts.sizes.price': 1 }
      : {};

  let productsDb = await Product.find({
    ...searchOptions,
    ...categoryOptions,
    ...brandOptions,
    ...styleOptions,
    ...sizeOptions,
    // ...colorOptions,
    ...priceOptions,
    ...shippingOptions,
    ...ratingOptions,
  })
    .skip(pageSize * (pageQuery - 1))
    .limit(pageSize)
    .sort(sortOptions)
    .lean();

  const reduceImagesProductsDb = productsDb.map((p) => {
    const newSubProducts = p.subProducts.map((s) => {
      return { ...s, images: s.images.slice(0, 2) };
    });

    return { ...p, subProducts: newSubProducts };
  });

  let products =
    sortQuery && sortQuery !== ''
      ? reduceImagesProductsDb
      : randomize(reduceImagesProductsDb);

  let categories = await Category.find().lean();
  let subCategories = await SubCategory.find()
    .populate({ path: 'parent', model: Category })
    .lean();

  //Dùng distinct để nhận về mảng chỉ chứa các value tương ứng với key
  // let colors = await Product.find({ ...categoryOptions }).distinct(
  //   'subProducts.color.color'
  // );
  let brandsDb = await Product.find({ ...categoryOptions }).distinct('brand');
  let sizes = await Product.find({ ...categoryOptions }).distinct(
    'subProducts.sizes.size'
  );
  let details = await Product.find({ ...categoryOptions }).distinct('details');

  //Sử dụng hàm helper filterArray lọc ra toàn bộ value của các Object Details
  let stylesDb = filterArray(details, 'Style');

  //Các kết quả lọc ra phía trên sẽ bị trùng lặp nhau
  //Ta cần remove các duplicate value bằng hàm helper removeDuplicates
  let styles = removeDuplicates(stylesDb);
  let brands = removeDuplicates(brandsDb);

  let totalProducts = await Product.countDocuments({
    ...searchOptions,
    ...categoryOptions,
    ...brandOptions,
    ...styleOptions,
    ...sizeOptions,
    // ...colorOptions,
    ...priceOptions,
    ...shippingOptions,
    ...ratingOptions,
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      categories: JSON.parse(JSON.stringify(categories)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
      sizes,
      // colors,
      brands,
      styles,
      paginationCount: Math.ceil(totalProducts.length / pageSize),
    },
  };
}

const sortingOptions = [
  {
    name: 'Рекомендуемые',
    value: 'Recommend',
  },
  {
    name: 'Популярные',
    value: 'popular',
  },
  {
    name: 'Новинки',
    value: 'newest',
  },
  {
    name: 'Хиты продаж',
    value: 'topSelling',
  },
  {
    name: 'Цена (низкая - высокая)',
    value: 'priceLowToHight',
  },
  {
    name: 'Цена (высокая - низкая)',
    value: 'priceHighToLow',
  },
];
