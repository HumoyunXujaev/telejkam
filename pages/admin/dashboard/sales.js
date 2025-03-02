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
import { Bar } from 'react-chartjs-2';

import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';

Chartjs.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


/* 
  The long cold start issue fix
  Relative issues: 
  #1 https://github.com/denvudd/react-dbmovies.github.io/issues/2
  #2 https://github.com/vercel/next.js/discussions/50783#discussioncomment-6139352
  #3 https://github.com/vercel/vercel/discussions/7961
  Documentation links:
  #1 https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props#getserversideprops-with-edge-api-routes
  !! Doesn't work in dev mode !!
*/
export const config = {
  runtime: 'experimental-edge', // warn: using an experimental edge runtime, the API might change
}

export default function Sales({ users, orders, products }) {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  const completedOrders = orders.filter((o) => o.status === 'Completed');

  useEffect(() => {
    const labels = [];
    const data = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      labels.unshift(dateString);
      const total = completedOrders
        .filter((o) => o.createdAt.split('T')[0] === dateString)
        .reduce((a, val) => a + val.total, 0);
      data.unshift(total);
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Продажи $',
          data,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgb(53, 162, 235, 0.4)',
        },
        {
          label: 'Заказы',
          data: labels.map(
            (label) =>
              completedOrders.filter((o) => o.createdAt.split('T')[0] === label)
                .length
          ),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132, 0.4)',
        },
      ],
    });
    setChartOptions({
      scales: {
        y: {
          type: 'logarithmic',
          beginAtZero: true,
          title: {
            display: true,
            text: 'количество',
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Месячная прибыль (Завершенные заказы)',
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    });
  }, [completedOrders]);

  return (
    <AdminLayout>
      <Head>
        <title>Sales</title>
      </Head>

      <div className={styled.header}>Dashboard</div>
      <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[1000vh] m-auto p-4 border rounded-lg bg-white'>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </AdminLayout>
  );
}

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
