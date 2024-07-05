/* eslint-disable @next/next/no-img-element */
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

import styled from './styles.module.scss';

const Empty = () => {
  const { data: session } = useSession();

  return (
    <div className={styled.empty}>
      <img src='/images/empty.png' alt='' />
      <span>В корзине ничего нет</span>

      <Link href='/browse'>
        <button className={`${styled.empty__btn} ${styled.empty__btn_v2}`}>
          Начать покупки
        </button>
      </Link>
    </div>
  );
};

export default Empty;
