/* eslint-disable @next/next/no-img-element */
import { AiFillSafetyCertificate, AiOutlineMenuUnfold } from 'react-icons/ai';
import { HiHeart } from 'react-icons/hi';
import {
  FaBuilding,
  FaCar,
  FaComment,
  FaHandsHelping,
  FaInfo,
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

const Top = ({ country }) => {
  const { data: session } = useSession();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 816px)' });
  const isExtraSmallScreen = useMediaQuery({ query: '(max-width: 386px)' });
  const dispatch = useDispatch();

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
            <span>Добро пожаловать в TELEJKAM</span>
          </li>

          <li className={styled.li}>
            <img src='icons/insta.png' alt='instagram' />
          </li>
          <li className={styled.li}>
            <img src='icons/tg.png' alt='instagram' />
          </li>
          <li className={styled.li}>
            <img src='icons/facebook.png' alt='facebook' />
          </li>

          {!isSmallScreen && (
            <>
              <li className={styled.li}>
                <MdCall style={{ fill: 'white' }} />
                <span>+998 99 191 11 36</span>
              </li>
              <li className={styled.li}>
                <RiCustomerServiceFill
                  style={{ color: 'black', fill: 'white' }}
                />
                <span>ПН-ВС, 9:00-21:00</span>
              </li>
              <li className={styled.li}>
                <FaTruck style={{ fill: 'white' }} />
                <span>Доставка</span>
              </li>
              <li className={styled.li}>
                <FaComment style={{ fill: 'white' }} />
                <span>О Нас</span>
              </li>
              <li className={styled.li}>
                <FaStore style={{ fill: 'white' }} />
                <span>Магазины</span>
              </li>
            </>
          )}

          {/* <li className={styled.li}>
            {session ? (
              <div className={styled.flex}>
                <img src={session.user.image} alt='Avatar' />
                <span>{session.user.name}</span>
                <RiArrowDropDownFill />
              </div>
            ) : (
              <div className={styled.flex}>
                <RiAccountPinCircleFill />
                <span>Account</span>
                <RiArrowDropDownFill />
              </div>
            )}
            <UserMenu session={session} />
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Top;
