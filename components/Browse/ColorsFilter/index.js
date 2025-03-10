import { useState } from 'react';
import { useRouter } from 'next/router';

import styled from '../styles.module.scss';
import { replaceQuery } from '@/utils/filter';
import PlusMinusBtn from '../PlusMinusBtn';
import { useTranslation } from 'next-i18next';

export default function ColorsFilter({ colors, colorHandler, checkChecked }) {
  const [show, setShow] = useState(true);
  const router = useRouter();
  const existedColor = router.query.color;
  const { t } = useTranslation();

  return (
    <div className={styled.filter}>
      <h3>
        {t('colors')}
        <PlusMinusBtn show={show} onClick={() => setShow((prev) => !prev)} />
      </h3>

      {show &&
        (colors.length > 0 ? (
          <div className={styled.filter__colors}>
            {colors.map((color, i) => {
              const check = checkChecked('color', color);
              return (
                <button
                  onClick={() =>
                    replaceQuery(existedColor, check, color, colorHandler)
                  }
                  style={{ background: `${color}` }}
                  className={check ? styled.colorActiveFilter : ''}
                  key={i}
                ></button>
              );
            })}
          </div>
        ) : (
          <p style={{ padding: '10px 0' }}>Found no colors</p>
        ))}
    </div>
  );
}
