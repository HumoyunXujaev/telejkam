import Layout from '@/components/Admin/Layout';
import Settings from '@/components/Admin/Settings';
import { Settings as SettingsModel } from '@/models/Settings';
import db from '@/utils/db';

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
