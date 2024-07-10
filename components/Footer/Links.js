/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';

import styled from './styles.module.scss';
import Image from 'next/image';
import { FaAddressCard, FaInstagram, FaTelegram } from 'react-icons/fa';

import { MdPhone } from 'react-icons/md';

const Links = () => {
  // only show the logo and address
  return (
    <div className={styled.footer__links}>
      {/* copyright icon with text 2024 telejkam */}
      ©2024
    </div>
  );
};

//
export default Links;
