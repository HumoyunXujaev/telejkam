import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  FcCurrencyExchange,
  FcPortraitMode,
  FcShop,
  FcPlus,
  FcList,
  FcParallelTasks,
  FcTimeline,
  FcSalesPerformance,
  FcSettings,
  FcCustomerSupport,
  FcSynchronize,
} from 'react-icons/fc';

import styled from './styles.module.scss';
import { toggleSidebar } from '@/store/expandSlice';

const Sidebar = () => {
  const { expandSidebar } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();

  const route = router.pathname;

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

        {/* Section 1 */}
        <div className={styled.sidebar__dropdown}>
          <div className={styled.sidebar__dropdown_heading}>
            <div className={styled.show}>Общее</div>
          </div>
          <ul className={styled.sidebar__list}>
            <li className={route === '/dashboard' ? styled.active : ''}>
              <Link href='/dashboard'>
                <div className={styled.link_content}>
                  <FcList />
                  <span className={styled.show}>Панель</span>
                </div>
              </Link>
            </li>
            <li
              className={
                route.includes('/dashboard/sales') ? styled.active : ''
              }
            >
              <Link href='/dashboard/sales'>
                <div className={styled.link_content}>
                  <FcSalesPerformance />
                  <span className={styled.show}>Sales</span>
                </div>
              </Link>
            </li>
            <li
              className={
                route.includes('/dashboard/orders') ? styled.active : ''
              }
            >
              <Link href='/dashboard/orders'>
                <div className={styled.link_content}>
                  <FcCurrencyExchange />
                  <span className={styled.show}>Заказы</span>
                </div>
              </Link>
            </li>
            <li
              className={
                route.includes('/dashboard/users') ? styled.active : ''
              }
            >
              <Link href='/dashboard/users'>
                <div className={styled.link_content}>
                  <FcPortraitMode />
                  <span className={styled.show}>Пользователи</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className={styled.sidebar__dropdown}>
          <div className={styled.sidebar__dropdown_heading}>
            <div className={styled.show}>Продукты</div>
          </div>
          <ul className={styled.sidebar__list}>
            <li
              className={
                route.includes('/dashboard/product/all') ? styled.active : ''
              }
            >
              <Link href='/dashboard/product/all'>
                <div className={styled.link_content}>
                  <FcShop />
                  <span className={styled.show}>Все Продукты</span>
                </div>
              </Link>
            </li>
            <li
              className={
                route.includes('/dashboard/product/create') ? styled.active : ''
              }
            >
              <Link href='/dashboard/product/create'>
                <div className={styled.link_content}>
                  <FcPlus />
                  <span className={styled.show}>Добавить Продукт</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className={styled.sidebar__dropdown}>
          <div className={styled.sidebar__dropdown_heading}>
            <div className={styled.show}>Категории</div>
          </div>
          <ul className={styled.sidebar__list}>
            <li
              className={
                route.includes('/dashboard/categories') ? styled.active : ''
              }
            >
              <Link href='/dashboard/categories'>
                <div className={styled.link_content}>
                  <FcParallelTasks />
                  <span className={styled.show}>Родительские Категории</span>
                </div>
              </Link>
            </li>
            <li
              className={
                route.includes('/dashboard/subcategories') ? styled.active : ''
              }
            >
              <Link href='/dashboard/subcategories'>
                <div className={styled.link_content}>
                  <FcTimeline />
                  <span className={styled.show}>Подкатегории</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className={styled.sidebar__dropdown}>
          <div className={styled.sidebar__dropdown_heading}>
            <div className={styled.show}>Действия</div>
          </div>
          <ul className={styled.sidebar__list}>
            <li>
              <Link href=''>
                <div className={styled.link_content}>
                  <FcSettings />
                  <span className={styled.show}>Параметры</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href=''>
                <div className={styled.link_content}>
                  <FcCustomerSupport />
                  <span className={styled.show}>Пользовательская помощь</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href=''>
                <div className={styled.link_content}>
                  <FcSynchronize />
                  <span className={styled.show}>Выйти</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
