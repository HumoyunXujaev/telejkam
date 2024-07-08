/* eslint-disable @next/next/no-img-element */
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'next-i18next';

import styled from './styles.module.scss';

const Empty = () => {
  const { t } = useTranslation();

  const { data: session } = useSession();

  return (
    <div className={styled.empty}>
      <img src='/images/empty.png' alt='' />
      <span>{t('header.cart_empty')}</span>

      <Link href='/browse'>
        <button className={`${styled.empty__btn} ${styled.empty__btn_v2}`}>
          {t('header.cart_shopping')}
        </button>
      </Link>
    </div>
  );
};

export default Empty;
