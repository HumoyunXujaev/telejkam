import React from 'react';
import * as Icon from 'react-feather';

import styled from './styles.module.scss';

const HasIconButton = (props) => {
  return (
    <button {...props} className={styled.button}>
      <p className={styled.button__title}>{props.children}</p>
      <div className={styled.svg__wrap}>
        <Icon.ArrowRight />
      </div>
    </button>
  );
};

export default HasIconButton;
