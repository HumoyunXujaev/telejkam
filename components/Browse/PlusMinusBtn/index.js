import React from 'react';
import * as Icon from 'react-feather';
export default function PlusMinusBtn({ show, onClick }) {
  return (
    <span style={{ cursor: 'pointer' }} onClick={onClick}>
      {show ? <Icon.Minus /> : <Icon.Plus />}
    </span>
  );
}
