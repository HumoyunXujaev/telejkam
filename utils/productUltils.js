import { addToCart, emptyCart, updateCart } from '@/store/cartSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const sortPricesArr = (products) => {
  if (products) {
    return products
      .map((product) => product.price_description)
      .sort((a, b) => a - b);
  }
};

export const priceAfterDiscount = (beforePrice, discount) => {
  return beforePrice - (beforePrice * discount) / 100;
};

export const findAllSizes = (subProducts) => {
  const sizeObjectsArr = subProducts
    ?.map((subProduct) => subProduct.sizes)
    .flat();

  const sizeArr = sizeObjectsArr
    ?.map((sizeObj) => sizeObj.size)
    .sort((a, b) => a - b);

  return [...new Set(sizeArr)];
};

export const addToCartHandler = async (e, id, style, size, cart, dispatch) => {
  e.preventDefault();
  e.stopPropagation();

  // get the product data from cache session storage or fetch from server if not exist
  const product = JSON.parse(sessionStorage.getItem(id));
  if (!product) {
    try {
      const response = await axios.get(
        `/api/product/${id}?style=${style}&size=${size}`
      );
      sessionStorage.setItem(id, JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error('Ошибка при загрузке данных продукта!');
      return;
    }
  }

  let _uniqueId = `${id}_${style}_${size}`;
  let exist = cart.cartItems.find((p) => p._uniqueId === _uniqueId);

  if (exist) {
    let newCart = cart.cartItems.map((p) =>
      p._uniqueId === exist._uniqueId ? { ...p, qty: p.qty + 1 } : p
    );
    dispatch(updateCart(newCart));
    toast.success('Продукт успешно добавлен в корзину!');
  } else {
    dispatch(
      addToCart({
        ...product,
        qty: 1,
        size: product.size,
        sizeIndex: size,
        _uniqueId,
      })
    );
    toast.success('Продукт успешно добавлен в корзину!');
  }
};

// empty cart
export const emptyCartHandler = (cart, dispatch) => {
  dispatch(emptyCart(cart));
};

export const calculateSubPrice = (items) => {
  const newSubTotal = items.reduce(
    (a, c) => a + Number(c.price_description) * c.qty,
    0
  );
  return Number(newSubTotal);
};

export const calculateTotalShipping = (items) => {
  const newShippingFee = items?.reduce((a, c) => a + Number(c.shipping), 0);
  return Number(newShippingFee);
};

export const calculateTotal = (items) => {
  const newTotal = items.reduce(
    (a, c) => a + Number(c.shipping) + Number(c.price_description) * c.qty,
    0
  );
  return Number(newTotal);
};

export const calculateTotalDescription = (items) => {
  const newTotal = items.reduce(
    (a, c) => a + Number(c.shipping) + Number(c.price_description) * c.qty,
    0
  );
  return Number(newTotal);
};
