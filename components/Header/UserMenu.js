/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { signOut, signIn } from 'next-auth/react';
import * as Icon from 'react-feather';

import styled from './styles.module.scss';

const UserMenu = ({ session }) => {
  return (
    <div className={styled.menu}>
      <h4>Welcome to Telejkam!</h4>
      {session ? (
        <div className={styled.userInfo}>
          <img
            src={session.user.image}
            alt='Avatar'
            className={styled.menu__img}
          />
          <div className={styled.col}>
            <h3>{session.user.name}</h3>
            <span onClick={() => signOut()}>
              <Icon.LogOut /> Sign out
            </span>
          </div>
        </div>
      ) : (
        <div className={styled.flex}>
          <button className={styled.btn__primary} onClick={() => signIn()}>
            Register
          </button>
          <button className={styled.btn__outline} onClick={() => signIn()}>
            Login
          </button>
        </div>
      )}
      <ul>
        <li>
          <Link href='/profile'>Account</Link>
        </li>
        <li>
          <Link href='/profile/orders?tab=1&q=all-orders'>My Orders</Link>
        </li>
        {/* <li>
          <Link href='/profile/messages'>Message Center</Link>
        </li> */}
        <li>
          <Link href='/profile/address?tab=0&q=addresses'>Address</Link>
        </li>
        <li>
          <Link href='/profile/wishlist'>Wishlist</Link>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
