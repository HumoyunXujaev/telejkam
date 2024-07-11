/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import * as Icon from 'react-feather';

import styled from './styles.module.scss';
import Image from 'next/image';

const Header = ({ link, text, link2, text2 }) => {
  return (
    <div className={styled.header}>
      <div className={styled.header__container}>
        <div className={styled.header__left}>
          <Link href='/'>
            <Image src='/telejkam.png' alt='' width='170' height='200' />
          </Link>
        </div>
        <div className={styled.header__right}>
          <Link href={link}>
            {text}
            <Icon.ChevronRight />
          </Link>
        </div>
        {text2 && link2 && (
          <div className={styled.header__right}>
            <Link href={link2}>
              {text2}
              <Icon.ChevronRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
