import React from 'react';
import Main from './Main';
import styled from './styles.module.scss';
import Top from './Top';
import { Settings } from '@/models/Settings';
import db from '@/utils/db';

const Header = ({ searchHandler, settings }) => {
  console.log(settings, 'header settings');
  return (
    <>
      <header className={styled.header}>
        <Top settings={settings} />
        <Main searchHandler2={searchHandler} settings={settings} />
      </header>
      <div className={styled.headerSpacer}></div>
    </>
  );
};

export default Header;

export async function getStaticProps() {
  await db.connectDb();

  // Fetch all required data
  const settings = await Settings.findOne({}).lean();
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
    revalidate: 60,
  };
}
