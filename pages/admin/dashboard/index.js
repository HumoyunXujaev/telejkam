/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { GiShoppingBag } from 'react-icons/gi';
import { FaUsers, FaMoneyCheckAlt } from 'react-icons/fa';
import { HiTemplate } from 'react-icons/hi';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { ImEye } from 'react-icons/im';

import styled from '@/styles/Dashboard.module.scss';
import AdminLayout from '@/components/Admin/Layout';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import db from '@/utils/db';
import Dropdown from '@/components/Admin/Dashboard/Dropdown';
import Link from 'next/link';

import { useEffect, useState } from 'react';

const Dashboard = ({ users, orders, products }) => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Telejkam - Админ Панель</title>
      </Head>
      <AdminLayout>
        <div className={styled.header}>Панель</div>

        <div className={styled.cards}>
          <div className={styled.card}>
            <div className={styled.card__icon}>
              <FaUsers />
            </div>
            <div className={styled.card__infos}>
              <h4>+{users.length} Пользователи</h4>
            </div>
          </div>

          <div className={styled.card}>
            <div className={styled.card__icon}>
              <GiShoppingBag />
            </div>
            <div className={styled.card__infos}>
              <h4>+{orders.length} Заказы</h4>
            </div>
          </div>

          <div className={styled.card}>
            <div className={styled.card__icon}>
              <HiTemplate />
            </div>
            <div className={styled.card__infos}>
              <h4>+{products.length} Продукты</h4>
            </div>
          </div>

          <div className={styled.card}>
            <div className={styled.card__icon}>
              <RiMoneyDollarCircleFill />
            </div>
            <div className={styled.card__infos}>
              <h4>
                {orders
                  .reduce((a, val) => a + val.total, 0)
                  .toLocaleString('ru-RU')}
                &nbsp; сум
                <br />
                <span>Прибыль</span>
              </h4>
            </div>
          </div>

          <div className={styled.card}>
            <div className={styled.card__icon}>
              <FaMoneyCheckAlt />
            </div>
            <div className={styled.card__infos}>
              <h4>
                {orders
                  .filter((o) => !o.isPaid)
                  .reduce((a, val) => a + val.total, 0)
                  .toLocaleString('ru-RU')}
                &nbsp;сум
                <br /> Не оплачено
              </h4>
            </div>
          </div>
        </div>

        <div className={styled.data}>
          <div className={styled.orders}>
            <div className={styled.title}>
              <h2>Недавние Заказы</h2>
              <Link href='/admin/dashboard/orders'>Смотреть все</Link>
            </div>
            <table>
              <thead>
                <tr>
                  <td>Имя</td>
                  <td>Сумма</td>
                  <td>Оплата</td>
                  <td>Статус</td>
                  <td>Смотреть</td>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i}>
                    <td>{order.shippingAddress.firstName}</td>
                    <td>${order.total}</td>
                    <td>
                      {order.isPaid ? (
                        <img src='../../../images/verified.webp' alt='' />
                      ) : (
                        <img src='../../../images/unverified1.png' alt='' />
                      )}
                    </td>
                    <td>
                      <div
                        className={`${styled.status} ${
                          order.status == 'Not processed'
                            ? styled.not_processed
                            : order.status == 'Processing'
                            ? styled.processing
                            : order.status == 'Dispatched'
                            ? styled.dispatched
                            : order.status == 'Cancelled'
                            ? styled.cancelled
                            : order.status == 'Completed'
                            ? styled.completed
                            : ''
                        }`}
                      >
                        {order.status}
                      </div>
                    </td>
                    <td>
                      <Link href={`/order/${order._id}`}>
                        <ImEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styled.users}>
            <div className={styled.title}>
              <h2>Недавние Пользователи</h2>
              <Link href='/admin/dashboard/users'>Смотреть Все</Link>
            </div>
            <table>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i}>
                    <td className={styled.user}>
                      <div className={styled.user__img}>
                        <img src={user.image} alt='' />
                      </div>
                      <td>
                        <h4>{user.name}</h4>
                        <span>{user.email}</span>
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export async function getServerSideProps(ctx) {
  await db.connectDb();
  const users = await User.find().lean();
  const orders = await Order.find()
    .populate({ path: 'user', model: User, strictPopulate: false })

    .lean();
  const products = await Product.find().lean();

  await db.disConnectDb();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
      orders: JSON.parse(JSON.stringify(orders)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default Dashboard;
