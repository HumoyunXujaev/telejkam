/* eslint-disable @next/next/no-img-element */
import { AiFillSafetyCertificate, AiOutlineMenuUnfold } from 'react-icons/ai';
import { HiHeart } from 'react-icons/hi';
import {
  FaBuilding,
  FaCar,
  FaComment,
  FaHandsHelping,
  FaInfo,
  FaLanguage,
  FaStore,
  FaTruck,
} from 'react-icons/fa';
import {
  RiCustomerServiceFill,
  RiAccountPinCircleFill,
  RiArrowDropDownFill,
  RiPhoneCameraFill,
} from 'react-icons/ri';
import { useSession } from 'next-auth/react';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';

import styled from './styles.module.scss';
import UserMenu from './UserMenu';
import { useDispatch } from 'react-redux';
import { toggleMobileCate } from '@/store/mobileCateSlice';
import { MdCall } from 'react-icons/md';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

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
            <AiOutlineMenuUnfold size={24} />
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
                <MdCall style={{ fill: 'white' }} />
                <a href='tel:+998991911136'>
                  <span>+998 99 191 11 36</span>
                </a>
              </li>
              <li className={styled.li}>
                <RiCustomerServiceFill
                  style={{ color: 'black', fill: 'white' }}
                />
                <span>{t('top.time')}</span>
              </li>
              <li className={styled.li}>
                <FaTruck style={{ fill: 'white' }} />
                <span>{t('top.delivery')}</span>
              </li>
              <li className={styled.li}>
                <FaComment style={{ fill: 'white' }} />
                <span>{t('top.about')}</span>
              </li>
              <li className={styled.li}>
                <FaStore style={{ fill: 'white' }} />
                <span>{t('top.stores')}</span>
              </li>
              <li className={styled.li}>
                <FaLanguage style={{ fill: 'white' }} />
                <span></span>
              </li>

              <li className={styled.li}>
                <Link href={router.pathname} locale='ru'>
                  {' '}
                  RU
                </Link>
              </li>
              <li className={styled.li}>
                <Link href={router.pathname} locale='uz'>
                  UZ
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
