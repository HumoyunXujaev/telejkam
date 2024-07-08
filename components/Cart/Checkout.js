import { FcShipped } from 'react-icons/fc';

import styled from './styles.module.scss';
import { useTranslation } from 'next-i18next';

const Checkout = ({
  subTotal,
  shippingFee,
  total,
  selected,
  saveCartToDbHandler,
}) => {
  const { t } = useTranslation();

  return (
    <div className={`${styled.cart__checkout} ${styled.card}`}>
      {/* Line 1 */}
      <div className={styled.cart__checkout_line}>
        <span>{t('header.cart_subtotal')}</span>
        <span>{subTotal} сум</span>
      </div>

      {/* Line 2 */}
      <div className={styled.cart__checkout_line}>
        <span>{t('shipping_fee')}</span>
        <span>{shippingFee} сум</span>
      </div>

      {/* Line 3 */}
      <div className={styled.cart__checkout_total}>
        <span>{t('header.cart_subtotal')}</span>
        <span>{total} сум</span>
      </div>

      <span className={styled.cart__checkout_tax}>(Tax included if any)</span>

      <div className={styled.cart__checkout_days}>
        <span>{t('receive_after')}</span>
        <span>
          <FcShipped /> {t('1_day')}
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
          {t('continue')} ({selected?.length})
        </button>
      </div>
    </div>
  );
};

export default Checkout;
