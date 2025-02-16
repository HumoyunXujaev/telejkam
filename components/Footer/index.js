import React from 'react';
import styled from './styles.module.scss';
import Links from './Links';
import Socials from './Socials';
import Copyright from './Copyright';
import AnimateWrapper from '../AnimateWrapper';
import Image from 'next/image';
import db from '@/utils/db';
import { Settings } from '@/models/Settings';

const Footer = ({ settings }) => {
  return (
    <AnimateWrapper>
      <footer className={styled.footer}>
        <div className={styled.footer__container}>
          <div className={styled.footer__left}>
            <Links />
          </div>
          <div className={styled.footer__center}>
            <Image src='/telejkam.png' alt='logo' width={130} height={130} />
          </div>
          <div className={styled.footer__right}>
            <Socials
              contacts={settings?.contacts}
              image1={'icons/insta.png'}
              image2={'icons/tg.png'}
              image3={'icons/telephone.png'}
              image4={'icons/address.png'}
            />
          </div>
        </div>
        <Copyright />
      </footer>
    </AnimateWrapper>
  );
};

export default Footer;

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
