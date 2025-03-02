import React from 'react';
import Layout from '@/components/Admin/Layout';
import CollapsibleTable from '@/components/Admin/Orders/Table';
import db from '@/utils/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';


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
