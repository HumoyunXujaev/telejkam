import React from 'react';
import {
  FaFacebookF,
  FaTiktok,
  FaSnapchatGhost,
  FaTelegram,
  FaInstagram,
  FaAddressBook,
  FaAddressCard,
  FaSearchLocation,
} from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { BsInstagram, BsTwitter, BsYoutube, BsPinterest } from 'react-icons/bs';

import styled from './styles.module.scss';
import Image from 'next/image';
import { MdPhone } from 'react-icons/md';

const Socials = () => {
  return (
    <div className={styled.footer__socials}>
      {/* <Image src='/telejkam.png' alt='logo' width={100} height={100} /> */}
      <section>
        {/* <h3>Связаться с Нами</h3> */}
        <ul>
          <li>
            <a href='https://www.instagram.com/telejkam.uz/' target='_blank'>
              <FaInstagram size={30} />
            </a>
          </li>
          <li>
            <a href='https://t.me/telejkamuzb' target='_blank'>
              <FaTelegram size={30} />
            </a>
          </li>
          <li>
            <a href='tel:+998977777777' target='_blank'>
              <MdPhone size={30} />
            </a>
          </li>
          <li>
            <a href='https://maps.app.goo.gl/fpHfGykZhe454Fdj7' target='_blank'>
              <FaSearchLocation size={30} />
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Socials;
