import React from 'react';
import Layout from '@/components/Admin/Layout';
import CollapsibleTable from '@/components/Admin/Orders/Table';
import db from '@/utils/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';

export default function OrdersPage({ orders }) {
  return (
    <Layout>
      <div className='header'>Заказы</div>
      <CollapsibleTable rows={orders} />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  await db.connectDb();
  const orders = await Order.find()
    .populate({
      path: 'user',
      model: User,
      select: 'name email image',
      strictPopulate: false,
    })
    .sort({ createdAt: -1 }) // corrected typo here, changed 'createdAdt' to 'createdAt'
    .lean();
  await db.disConnectDb();

  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}
