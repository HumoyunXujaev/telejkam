import Link from 'next/link';
import Image from 'next/image';
import styled from './styles.module.scss';
import { useDispatch } from 'react-redux';
import { toggleMobileCate } from '@/store/mobileCateSlice';
import { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import * as Icon from 'react-feather';

const Menu = ({ categories, settings }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  return (
    <Fragment>
      <div className={styled.menu}>
        <ul>
          <a className={styled.menu__header}>
            <Icon.Layers size={25} />
            {t('categories')}
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
            <Icon.PhoneCall size={25} />
            {t('contacts')}
          </a>
          <div className={styled.menu__list}>
            <li className={styled.menu__item}>
              <Link
                href={settings?.contacts?.phone}
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
                  <a href={settings?.contacts?.phone}>{t('phone')}</a>
                </span>
              </Link>
            </li>

            <li className={styled.menu__item}>
              <Link
                href={settings?.contacts?.location}
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

                <span>{t('address')}</span>
              </Link>
            </li>

            <li className={styled.menu__item}>
              <Link
                href={settings?.contacts?.telegram}
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
                href={settings?.contacts?.instagram}
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
          </div>
        </ul>
      </div>
    </Fragment>
  );
};

export default Menu;
