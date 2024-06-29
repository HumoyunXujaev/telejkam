import { useState } from 'react';
import styled from '../styles.module.scss';
import ShowAllBtn from '../ShowAllBtn';
import useSeeMore from '@/hook/useSeeMore';
import CheckboxItem from '../CheckboxItem';
import PlusMinusBtn from '../PlusMinusBtn';

export default function SortFilter({ sortingOptions, sortQuery, sortHandler }) {
  const [show, setShow] = useState(true);
  const { itemsQty, showAllHandler, hideBtn } = useSeeMore(sortingOptions);

  return (
    <div className={styled.filter}>
      <h3>
        Фильтровать по
        <PlusMinusBtn show={show} onClick={() => setShow((prev) => !prev)} />
      </h3>

      {show && (
        <div className={styled.filter__categories}>
          {sortingOptions.slice(0, itemsQty).map((sort, i) => {
            const check = sortQuery === sort.value;

            return (
              <CheckboxItem
                key={i}
                onClick={() => {
                  sortHandler(sort.value);
                }}
                id={sort.value}
                check={check}
                content={sort.name}
                name='sort'
                type='radio'
              />
            );
          })}
          {sortingOptions.length > 5 && (
            <div className={`${styled.showHideBtn}`}>
              <ShowAllBtn hideBtn={hideBtn} onClick={showAllHandler} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
