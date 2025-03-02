import React from 'react';
import Layout from '@/components/Admin/Layout';
import EnhancedTable from '@/components/Admin/User/Table';
import db from '@/utils/db';
import { User } from '@/models/User';

import styled from '@/styles/Users.module.scss';
import UserCreate from '@/components/Admin/User/UserCreate';


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

export default function UserPage({ users }) {
  return (
    <Layout>
      <UserCreate />
      <div className={styled.header}>Пользователи</div>
      <EnhancedTable rows={users} />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  await db.connectDb();
  const users = await User.find().sort({ createdAt: -1 }).lean();

  await db.disConnectDb();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}
