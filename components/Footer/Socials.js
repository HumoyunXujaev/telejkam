import React from 'react';
import styled from './styles.module.scss';
import Image from 'next/image';

const Socials = ({ contacts, image1, image2, image3, image4 }) => {
  return (
    <div className={styled.footer__socials}>
      <section>
        <ul>
          {contacts?.instagram && (
            <li>
              <a
                href={contacts.instagram}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image src={image1} alt='Instagram' width={30} height={30} />
              </a>
            </li>
          )}
          {contacts?.telegram && (
            <li>
              <a
                href={contacts.telegram}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image src={image2} alt='Telegram' width={30} height={30} />
              </a>
            </li>
          )}
          {contacts?.phone && (
            <li>
              <a
                href={`tel:${contacts.phone}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image src={image3} alt='Phone' width={30} height={30} />
              </a>
            </li>
          )}
          {contacts?.location && (
            <li>
              <a
                href={contacts.location}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image src={image4} alt='Location' width={30} height={30} />
              </a>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Socials;
