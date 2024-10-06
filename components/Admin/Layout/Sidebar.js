/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  FcCurrencyExchange,
  FcPortraitMode,
  FcSms,
  FcShop,
  FcPlus,
  FcList,
  FcParallelTasks,
  FcTimeline,
  FcPuzzle,
  FcSalesPerformance,
  FcSettings,
  FcCustomerSupport,
  FcAdvertising,
  FcSynchronize,
} from 'react-icons/fc';

import styled from './styles.module.scss';
import { toggleSidebar } from '@/store/expandSlice';

const Sidebar = () => {
  const { expandSidebar } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const Router = useRouter();

  const route = Router.pathname;

  const expand = expandSidebar.expandSidebar;

  const expandHandler = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className={`${styled.sidebar} ${expand ? styled.opened : ''}`}>
      {/* Toggle button */}
      <div className={styled.sidebar__toggle} onClick={expandHandler}>
        <div
          className={styled.sidebar__toggle_wrap}
          style={{
            transform: expand ? 'rotate(180deg)' : '',
            transition: 'all 0.2s',
          }}
        >
          <FaAngleDoubleRight />
        </div>
      </div>

      <div className={styled.sidebar__container}>
        <div className={styled.sidebar__header}>
          <img src='/telejkam.png' alt='Telejkam' />
          <span>Админ</span>
        </div>

        {/* <div
          className={styled.sidebar__user}
          style={{ width: expand ? "250px" : "" }}
        >
          <img src={session?.user?.image} alt="" />
          <div className={styled.show}>
            <span>Welcome back 👋</span>
            <span>{session?.user?.name}</span>
          </div>
        </div> */}

        {/* Section 1 */}

        <div className={styled.sidebar__dropdown}>
          <div className={styled.sidebar__dropdown_heading}>
            <div className={styled.show}>Общее</div>
          </div>
          <ul className={styled.sidebar__list}>
            <Link href='/dashboard'>
              <li className={route === '/dashboard' && styled.active}>
                <FcList />
                <span className={styled.show}>Панель</span>
              </li>
            </Link>
            <Link href='/dashboard/sales'>
              <li
                className={route.includes('/dashboard/sales') && styled.active}
              >
                <FcSalesPerformance />
                <span className={styled.show}>Sales</span>
              </li>
            </Link>
            <Link href='/dashboard/orders'>
              <li
                className={route.includes('/dashboard/orders') && styled.active}
              >
                <FcCurrencyExchange />
                <span className={styled.show}>Заказы</span>
              </li>
            </Link>
            <Link href='/dashboard/users'>
              <li
                className={route.includes('/dashboard/users') && styled.active}
              >
                <FcPortraitMode />
                <span className={styled.show}>Пользователи</span>
              </li>
            </Link>
            {/* <li
              className={
                route.includes('/admin/dashboard/messages') && styled.active
              }
            >
              <Link href='/admin/dashboard/messages'>
                <FcSms />
                <span className={styled.show}>Messages</span>
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Section 2 */}
        <div className={styled.sidebar__dropdown}>
          <div className={styled.sidebar__dropdown_heading}>
            <div className={styled.show}>Продукты</div>
          </div>

          <ul className={styled.sidebar__list}>
            <Link href='/dashboard/product/all'>
              <li
                className={
                  route.includes('/dashboard/product/all') && styled.active
                }
              >
                <FcShop />
                <span className={styled.show}>Все Продукты</span>
              </li>
            </Link>{' '}
            <Link href='/dashboard/product/create'>
              <li
                className={
                  route.includes('/dashboard/product/create') && styled.active
                }
              >
                <FcPlus />
                <span className={styled.show}>Добавить Продукт</span>
              </li>
            </Link>
          </ul>
        </div>

        <div className={styled.sidebar__dropdown}>
          <div className={styled.sidebar__dropdown_heading}>
            <div className={styled.show}>Категории</div>
          </div>
          <ul className={styled.sidebar__list}>
            {' '}
            <Link href='/dashboard/categories'>
              <FcParallelTasks />
              <li
                className={
                  route.includes('/dashboard/categories') && styled.active
                }
              >
                <span className={styled.show}>Родительские Категории</span>
              </li>
            </Link>{' '}
            <Link href='/dashboard/subcategories'>
              <li
                className={
                  route.includes('/dashboard/subcategories') && styled.active
                }
              >
                <FcTimeline />
                <span className={styled.show}>Подкатегории</span>
              </li>{' '}
            </Link>
          </ul>
        </div>

        {/* Section 4 */}
        <div className={styled.sidebar__dropdown}>
          <div className={styled.sidebar__dropdown_heading}>
            <div className={styled.show}>Действия</div>
          </div>
          <ul className={styled.sidebar__list}>
            {' '}
            <Link href=''>
              <li>
                <FcSettings />
                <span className={styled.show}>Параметры</span>
              </li>
            </Link>
            <li>
              <Link href=''>
                <FcCustomerSupport />
                <span className={styled.show}>Пользовательская помощь</span>
              </Link>
            </li>
            <li>
              <Link href=''>
                <FcSynchronize />
                <span className={styled.show}>Выйти</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
