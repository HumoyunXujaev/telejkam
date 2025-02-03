import React from 'react';
import Layout from '@/components/Admin/Layout';
import SettingsManager from '@/components/Admin/Settings';

const Settings = () => {
  return (
    <Layout>
      <div className='header'>Настройки сайта</div>
      <SettingsManager />
    </Layout>
  );
};

export default Settings;
