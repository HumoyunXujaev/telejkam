import Link from 'next/link';
import React from 'react';

import styled from './styles.module.scss';
import * as Icon from 'react-feather';

const Policy = ({ country }) => {
  return (
    <div className={styled.footer__policy}>
      <section>
        <ul>
          {data.map((link, index) => {
            return (
              <li key={index}>
                <Link href={link.link}>{link.name}</Link>
              </li>
            );
          })}
          <li>
            <a href=''>
              <Icon.Map /> <span>{country?.name}</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

const data = [
  {
    name: 'Privacy Center',
    link: '',
  },
  {
    name: 'Privacy & Cookie Policy',
    link: '',
  },
  {
    name: 'Manage Cookies',
    link: '',
  },
  {
    name: 'Terms & Conditions',
    link: '',
  },
  {
    name: 'Copyright Notice',
    link: '',
  },
];

export default Policy;
