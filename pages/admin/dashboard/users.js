import React from 'react';
import Layout from '@/components/Admin/Layout';
import EnhancedTable from '@/components/Admin/User/Table';
import db from '@/utils/db';
import { User } from '@/models/User';

import styled from '@/styles/Users.module.scss';
import UserCreate from '@/components/Admin/User/UserCreate';

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
