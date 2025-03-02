import Layout from '@/components/Admin/Layout';
import Settings from '@/components/Admin/Settings';
import { Settings as SettingsModel } from '@/models/Settings';
import db from '@/utils/db';


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

export default function SettingsPage({ settings }) {
  return (
    <Layout>
      <div className='header'>Site Settings</div>
      <Settings initialSettings={settings} />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  await db.connectDb();
  const settings = await SettingsModel.findOne({}).lean();
  await db.disConnectDb();

  return {
    props: {
      settings: JSON.parse(
        JSON.stringify(
          settings || {
            heroImages: [],
            contacts: {
              phone: '',
              address: '',
              telegram: '',
              instagram: '',
              location: '',
            },
          }
        )
      ),
    },
  };
}
