import { FcShipped } from 'react-icons/fc';

import styled from './styles.module.scss';

const Checkout = ({
  subTotal,
  shippingFee,
  total,
  selected,
  saveCartToDbHandler,
}) => {
  return (
    <div className={`${styled.cart__checkout} ${styled.card}`}>
      {/* Line 1 */}
      <div className={styled.cart__checkout_line}>
        <span>Сумма</span>
        <span>{subTotal} сум</span>
      </div>

      {/* Line 2 */}
      <div className={styled.cart__checkout_line}>
        <span>Доставка</span>
        <span>{shippingFee} сум</span>
      </div>

      {/* Line 3 */}
      <div className={styled.cart__checkout_total}>
        <span>Сумма</span>
        <span>{total} сум</span>
      </div>

      <span className={styled.cart__checkout_tax}>(Tax included if any)</span>

      <div className={styled.cart__checkout_days}>
        <span>Получите через</span>
        <span>
          <FcShipped /> 1 день
        </span>
      </div>

      <div className={styled.cart__checkout_note}>
        <span>
          * Нажимая &quot;Продолжить&quot; вы соглашаетесь с политикой Telejkam
          Terms
        </span>
      </div>

      <div className={styled.cart__checkout_submit}>
        <button
          disabled={selected?.length === 0}
          style={{
            background: `${selected?.length === 0 ? '#eee' : ''}`,
            cursor: `${selected?.length === 0 ? 'not-allowed' : ''}`,
          }}
          onClick={() => saveCartToDbHandler()}
        >
          Продолжить ({selected?.length})
        </button>
      </div>
    </div>
  );
};

export default Checkout;
