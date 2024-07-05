/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';

import styled from './styles.module.scss';
import Image from 'next/image';

const Links = () => {
  return (
    <div className={styled.footer__links}>
      {links.map((link, index) => {
        return (
          <ul key={index}>
            {/* Heading */}

            <b>{link.heading}</b>

            {/* Items */}
            {link.links.map((link, index) => (
              <li key={index}>
                <Link href={link.link}>{link.name}</Link>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
};

const links = [
  {
    heading: 'TELEJKAM',
    links: [
      {
        name: 'О Нас',
        link: '',
      },
      {
        name: 'Контакты',
        link: '',
      },
      {
        name: 'Карьера',
        link: '',
      },
    ],
  },
  {
    heading: 'Помощь',
    links: [
      {
        name: 'Доставка',
        link: '',
      },
      {
        name: 'Оплата/Возврат',
        link: '',
      },
      {
        name: 'Как заказать',
        link: '',
      },
      {
        name: 'Как отследить заказ',
        link: '',
      },
    ],
  },
  {
    heading: 'Партнерам',
    links: [
      {
        name: 'Стать партнером',
        link: '',
      },
      {
        name: 'Партнерская программа',
        link: '',
      },
      {
        name: 'Партнерский кабинет',
        link: '',
      },
      {
        name: 'Партнерский договор',
        link: '',
      },
    ],
  },
];

export default Links;
