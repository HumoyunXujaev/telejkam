'use client';

import styled from '@/styles/AllProducts.module.scss';
import Layout from '@/components/Admin/Layout';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import db from '@/utils/db';
import ProductCard from '@/components/Admin/AllProducts/ProductCard';
import ProductItem from '@/components/Admin/AllProducts/ProductItem';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Router from 'next/router';
import Cookies from 'js-cookie';

export default function AllProductsPage({ products }) {
  const [token, setToken] = useState('');

  // Fetch the token when the component mounts
  useEffect(() => {
    const tokenFromCookies = Cookies.get('__Secure-next-auth.session-token');
    setToken(tokenFromCookies);
  }, []);

  const statistics = useMemo(() => {
    const subProductsSizes = products.map((p) =>
      p.subProducts.map((s) => s.sizes).flat()
    );

    const itemQty = subProductsSizes.flat().length;

    const outStock = subProductsSizes.filter(
      (o) => o.reduce((a, c) => a + c.qty, 0) == 0
    );

    const productCategories = products.map((p) => p.category._id);
    const productUniqueCategories = [...new Set(productCategories)];

    return { itemQty, outStock, productUniqueCategories };
  }, [products]);

  console.log(token, '-token');

  const handleDelete = async (id) => {
    try {
      if (!token) {
        console.error('Token is not available');
        return;
      }
      await axios.post(
        `https://www.telejkam.uz/api/admin/product/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Router.reload();
      console.log('Продукт успешно удален!');
      // toast.success('Product deleted successfully!');
    } catch (err) {
      console.error(err);
      // toast.error('Something went wrong!', { error: err.message });
    }
  };

  return (
    <Layout>
      <div className={styled.header}>Все продукты</div>

      {/* Statistics */}
      <div className={styled.products__stats}>
        <div className={styled.products__stats_item}>
          <span>Общие продукты</span>
          <span>{products.length}</span>
        </div>

        <div className={styled.products__stats_item}>
          <span>Нет в наличии</span>
          <span>{statistics.outStock.length}</span>
        </div>

        <div className={styled.products__stats_item}>
          <span>Общая (штук)</span>
          <span>{statistics.itemQty}</span>
        </div>

        <div className={styled.products__stats_item}>
          <span>Категории</span>
          <span>{statistics.productUniqueCategories.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className={styled.products__table}>
        <table className={styled.list}>
          <thead>
            <th>Имя Продукта</th>
            <th>Категория</th>
            {/* <th>Стили</th> */}
            <th>Склад</th>
            <th>Дата добавления</th>
          </thead>
          <tbody>
            {products?.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      <div className={styled.header}>продукты и стили</div>
      {/* Swiper */}
      <div className={styled.products_swiper}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  await db.connectDb();

  const products = await Product.find({})
    .populate({ path: 'category', model: Category })
    .sort({ createdAt: -1 })
    .lean();

  await db.disConnectDb();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
