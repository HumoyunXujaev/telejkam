import React from 'react';
import { useState } from 'react';

import db from '@/utils/db';
import Layout from '../../../components/Admin/Layout';
import { Category } from '@/models/Category';
import { SubCategory } from '@/models/SubCategory';
import SubCreate from '@/components/Admin/SubCategories/SubCreate';
import SubList from '@/components/Admin/SubCategories/SubList';


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

export default function SubCategoriesPage({ categories, subCategories }) {
  const [data, setData] = useState(subCategories);
  return (
    <Layout>
      <SubCreate setSubCategories={setData} categories={categories} />
      <SubList
        subCategories={data}
        setSubCategories={setData}
        categories={categories}
      />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  await db.connectDb();

  const categories = await Category.find({}).sort({ updatedAt: -1 }).lean();
  const subCategories = await SubCategory.find({})
    .populate({ path: 'parent', model: Category })
    .lean()
    .sort({ updatedAt: -1 })
    .lean();

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
    },
  };
}
