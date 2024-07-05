import React, { useState } from 'react';

import styled from './styles.module.scss';
import Policy from './Policy';
import Links from './Links';
import Newsletter from './Newsletter';
import Payment from './Payment';
import Socials from './Socials';
import Copyright from './Copyright';
import AnimateWrapper from '../AnimateWrapper';
import Image from 'next/image';

const Footer = ({ country }) => {
  return (
    <AnimateWrapper className='load-hidden'>
      <footer className={styled.footer}>
        <div className={styled.footer__container}>
          {/* logo right in the middle of the footer */}

          <div className={styled.footer__left}>
            <Links />
          </div>
          <div className={styled.footer__center}>
            <Image src='/telejkam.png' alt='logo' width={130} height={130} />
          </div>
          <div className={styled.footer__right}>
            <Socials />
          </div>
        </div>
        <Copyright />
      </footer>
    </AnimateWrapper>
  );
};

export default Footer;
