import { Tooltip } from '@mui/material';
import styled from './styles.module.scss';

import { useRouter } from 'next/router';

export default function HeadingFilters({ priceHandler, multiPriceHandler }) {
  const router = useRouter();
  return (
    <div className={styled.filters}>
      <div className={styled.filters__priceBtns_wrap}>
        <span>Цена :</span>
        <div className={styled.filters__priceBtns}>
          <Tooltip
            title={<h4>Смотреть продукты между 1,000,000 - 3,000,000</h4>}
            placement='top'
            arrow
            onClick={() => multiPriceHandler(500, '')}
          >
            <button className={styled.tooltip_btn}>
              <span style={{ height: '100%' }}></span>
            </button>
          </Tooltip>

          <Tooltip
            title={<h4>Смотреть продукты между 500,000-1,000,000</h4>}
            placement='top'
            arrow
            onClick={() => multiPriceHandler(500000, 1000000)}
          >
            <button className={styled.tooltip_btn}>
              <span style={{ height: '75%' }}></span>
            </button>
          </Tooltip>

          <Tooltip
            title={<h4>Смотреть продукты мужду 100,000-500,000</h4>}
            placement='top'
            arrow
            onClick={() => multiPriceHandler(100000, 500000)}
          >
            <button className={styled.tooltip_btn}>
              <span style={{ height: '50%' }}></span>
            </button>
          </Tooltip>

          <Tooltip
            title={<h4>Смотреть продукты между 50,000-100,000</h4>}
            placement='top'
            arrow
            onClick={() => multiPriceHandler(50000, 100000)}
          >
            <button className={styled.tooltip_btn}>
              <span style={{ height: '25%' }}></span>
            </button>
          </Tooltip>

          <Tooltip
            title={<h4>Смотреть продукты меньше чем 50,000</h4>}
            placement='top'
            arrow
            onClick={() => multiPriceHandler(0, 50000)}
          >
            <button className={styled.tooltip_btn}>
              <span style={{ height: '10%' }}></span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* <div className={styled.filters__price}>
        <span>Price range :</span>
        <input
          type='number'
          placeholder='Min price'
          min='0'
          onChange={(e) => priceHandler(e.target.value, 'min')}
          value={router.query.price?.split('_')[0] || 0}
        />
        <input
          type='number'
          placeholder='Max price'
          min='0'
          onChange={(e) => priceHandler(e.target.value, 'max')}
          value={router.query.price?.split('_')[1] || 0}
        />
      </div> */}
    </div>
  );
}
