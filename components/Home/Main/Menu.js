import Link from 'next/link';
import Image from 'next/image';
import { MdDashboard } from 'react-icons/md';
import styled from './styles.module.scss';
import { AiFillCloseSquare } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { toggleMobileCate } from '@/store/mobileCateSlice';
import { Fragment } from 'react';

const Menu = ({ categories }) => {
  const dispatch = useDispatch();
  return (
    <Fragment>
      <div className={styled.menu}>
        <ul>
          <a className={styled.menu__header}>
            <MdDashboard size={25} />
            Категории
            <button
              className={styled.menu__header_btn}
              onClick={() => dispatch(toggleMobileCate())}
            >
              <AiFillCloseSquare size={20} />
            </button>
          </a>
          <div className={styled.menu__list}>
            {categories?.map((item, index) => (
              <li className={styled.menu__item} key={index}>
                <Link
                  href={`/browse?category=${item._id}`}
                  onClick={() => dispatch(toggleMobileCate())}
                  key={index}
                >
                  <div className={styled.menu__item_img}>
                    <Image
                      fill={true}
                      style={{ objectFit: 'cover' }}
                      src={'icons/menu2.png'}
                      alt='smth'
                    />
                  </div>

                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </div>
        </ul>
      </div>

      <div className={styled.menu}>
        <ul>
          <a className={styled.menu__header}>
            <MdDashboard size={25} />
            Контакты
            <button
              className={styled.menu__header_btn}
              onClick={() => dispatch(toggleMobileCate())}
            >
              <AiFillCloseSquare size={20} />
            </button>
          </a>
          <div className={styled.menu__list}>
            <li className={styled.menu__item}>
              <Link
                href={`tel:+32213213312`}
                onClick={() => dispatch(toggleMobileCate())}
              >
                <div className={styled.menu__item_img}>
                  <Image
                    fill={true}
                    style={{ objectFit: 'cover' }}
                    src={`icons/phone.png`}
                    alt='phone'
                  />
                </div>

                <span>
                  <a href='tel:+380000000000'>Телефон</a>
                </span>
              </Link>
            </li>
            {/* <li className={styled.menu__item}>
              <Link href={'mailto:hujaevhumoyun01@gmail.com'}>
                <div className={styled.menu__item_img}>
                  <Image
                    fill={true}
                    style={{ objectFit: 'cover' }}
                    src={`icons/email.png`}
                    alt='email'
                  />
                </div>
                <span>Почта</span>
              </Link>
            </li> */}

            <li className={styled.menu__item}>
              <Link
                href={`https://www.google.com/maps/place/`}
                onClick={() => dispatch(toggleMobileCate())}
              >
                <div className={styled.menu__item_img}>
                  <Image
                    fill={true}
                    style={{ objectFit: 'cover' }}
                    src={`icons/address.png`}
                    alt='location'
                  />
                </div>

                <span>Адресс</span>
              </Link>
            </li>

            <li className={styled.menu__item}>
              <Link
                href={`https://www.telegram.com/`}
                onClick={() => dispatch(toggleMobileCate())}
              >
                <div className={styled.menu__item_img}>
                  <Image
                    fill={true}
                    style={{ objectFit: 'cover' }}
                    src={`icons/tg.png`}
                    alt='telegram'
                  />
                </div>

                <span>TELEGRAM</span>
              </Link>
            </li>

            <li className={styled.menu__item}>
              <Link
                href={`https://www.instagram.com/`}
                onClick={() => dispatch(toggleMobileCate())}
              >
                <div className={styled.menu__item_img}>
                  <Image
                    fill={true}
                    style={{ objectFit: 'cover' }}
                    src={`icons/insta.png`}
                    alt='instagram'
                  />
                </div>

                <span>INSTAGRAM</span>
              </Link>
            </li>

            {/* <li className={styled.menu__item}>
              <Link
                href={`https://www.twitter.com/`}
                onClick={() => dispatch(toggleMobileCate())}
              >
                <div className={styled.menu__item_img}>
                  <Image
                    fill={true}
                    style={{ objectFit: 'cover' }}
                    src={`icons/twitter.png`}
                    alt='twitter'
                  />
                </div>
                <span>TWITTER</span>
              </Link>
            </li> */}

            {/* <li className={styled.menu__item}>
              <Link
                href={`https://www.youtube.com/`}
                onClick={() => dispatch(toggleMobileCate())}
              >
                <div className={styled.menu__item_img}>
                  <Image
                    fill={true}
                    style={{ objectFit: 'cover' }}
                    src={`icons/yt.png`}
                    alt='youtube'
                  />
                </div>
                <span>YOUTUBE</span>
              </Link>
            </li> */}
          </div>
        </ul>
      </div>
    </Fragment>
  );
};

export default Menu;
