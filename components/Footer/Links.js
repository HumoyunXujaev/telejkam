/* eslint-disable @next/next/no-img-element */
import React from 'react';

import styled from './styles.module.scss';

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
