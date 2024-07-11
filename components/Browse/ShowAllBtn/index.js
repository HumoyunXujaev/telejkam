import { Button } from '@mui/material';
import React from 'react';

import * as Icon from 'react-feather';

export default function ShowAllBtn({ hideBtn, onClick }) {
  return (
    <Button
      endIcon={
        hideBtn ? <Icon.ChevronUp size={13} /> : <Icon.ChevronDown size={13} />
      }
      variant='outlined'
      onClick={onClick}
    >
      {hideBtn ? 'Закрыть' : 'Смотреть все'}
    </Button>
  );
}
