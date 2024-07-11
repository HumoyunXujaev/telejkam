/* eslint-disable @next/next/no-img-element */

import { useSession } from 'next-auth/react';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';

import styled from './styles.module.scss';
import { useDispatch } from 'react-redux';
import { toggleMobileCate } from '@/store/mobileCateSlice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import * as Icon from 'react-feather';

const Top = ({ country }) => {
  const { t } = useTranslation();

  const { data: session } = useSession();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 816px)' });
  const isExtraSmallScreen = useMediaQuery({ query: '(max-width: 386px)' });
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className={styled.top}>
      <div className={styled.top__container}>
        <div>
          <div
            className={styled.menuIcon}
            onClick={() => dispatch(toggleMobileCate())}
          >
            {/* <AiOutlineMenuUnfold size={24} /> */}
          </div>
        </div>

        <ul className={styled.top__list}>
          {/* welcome text at left top corner */}
          <li className={styled.li_left}>
            <span>{t('top.welcome')}</span>
          </li>

          {/* <li className={styled.li}>
            <a href='https://www.instagram.com/telejkam.uz/' target='_blank'>
              <img src='icons/insta.png' alt='instagram' />
            </a>
          </li>
          <li className={styled.li}>
            <a href='https://t.me/telejkam' target='_blank'>
              <img src='icons/tg.png' alt='instagram' />
            </a>
          </li> */}

          {!isSmallScreen && (
            <>
              <li className={styled.li}>
                <Icon.PhoneCall />
                <a href='tel:+998991911136'>
                  <span>+998 99 191 11 36</span>
                </a>
              </li>
              <li className={styled.li}>
                <Icon.Briefcase style={{ color: 'white' }} />
                <span>{t('top.time')}</span>
              </li>
              <li className={styled.li}>
                <Icon.Truck />
                <span>{t('top.delivery')}</span>
              </li>
              <li className={styled.li}>
                <Icon.MessageCircle />
                <span>{t('top.about')}</span>
              </li>
              <li className={styled.li}>
                <Icon.Home />
                <span>{t('top.stores')}</span>
              </li>
              <li className={styled.li}>
                <Icon.Globe />
                <span></span>
              </li>

              <li className={styled.li}>
                <Link href={router.pathname} locale='ru'>
                  {' '}
                  Рус
                </Link>
              </li>
              <li className={styled.li}>
                <Link href={router.pathname} locale='uz'>
                  O`&apos;zb
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Top;
