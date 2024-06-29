import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import styled from '../styles/Checkout.module.scss';
import Header from '@/components/Cart/Header';
import Products from '@/components/Checkout/Products';
import Shipping from '@/components/Checkout/Shipping';
import PaymentMethods from '@/components/Checkout/PaymentMethods';
import Summary from '@/components/Checkout/Summary';
import { useSelector } from 'react-redux';

const Checkout = ({ user }) => {
  const { cart } = useSelector((state) => ({ ...state }));

  const [addresses, setAddresses] = useState(
    localStorage.getItem('addresses')
      ? JSON.parse(localStorage.getItem('addresses'))
      : []
  );
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [totalAfterDiscount, setTotalAfterDiscount] = useState('');

  useEffect(() => {
    // let check = addresses.find((a) => a.active === true);
    // if (check) {
    setSelectedAddress(addresses);
    // } else {
    //   setSelectedAddress('');
    // }
  }, [addresses]);

  console.log('Cart:', cart);

  return (
    <>
      <Header link='/cart' text='Вернуться в корзину' />
      <div className={styled.checkout}>
        <div className={styled.checkout__left_side}>
          <Shipping
            user={user}
            addresses={addresses}
            setAddresses={setAddresses}
          />
          <Products cart={cart} />
        </div>
        <div className={styled.checkout__right_side}>
          <PaymentMethods
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
          <Summary
            totalAfterDiscount={totalAfterDiscount}
            setTotalAfterDiscount={setTotalAfterDiscount}
            user={user}
            cart={cart}
            paymentMethod={paymentMethod}
            selectedAddress={selectedAddress}
          />
        </div>
      </div>
    </>
  );
};

export default Checkout;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const cart =
    typeof window !== 'undefined' && localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : { cartItems: [] };

  // You may fetch user details if needed
  // const user = session ? await User.findById(session.user.id) : null;

  return {
    props: {
      cart: JSON.parse(JSON.stringify(cart)),
      user: session?.user || null,
    },
  };
}
