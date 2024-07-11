import React from 'react';

import styled from './styles.module.scss';
import Image from 'next/image';

const Socials = () => {
  return (
    <div className={styled.footer__socials}>
      <section>
        <ul>
          <li>
            <a href='https://www.instagram.com/telejkam.uz/' target='_blank'>
              <Image src='icons/insta.png' alt='smt' width={30} height={30} />
            </a>
          </li>
          <li>
            <a href='https://t.me/telejkamuzb' target='_blank'>
              <Image src='icons/tg.png' alt='smt' width={30} height={30} />
            </a>
          </li>
          <li>
            <a href='tel:+998977777777' target='_blank'>
              <Image
                src='icons/telephone.png'
                alt='smt'
                width={30}
                height={30}
              />
            </a>
          </li>
          <li>
            <a href='https://maps.app.goo.gl/fpHfGykZhe454Fdj7' target='_blank'>
              <Image src='icons/address.png' alt='smt' width={30} height={30} />
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Socials;
