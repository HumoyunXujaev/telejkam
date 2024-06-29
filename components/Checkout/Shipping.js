/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { VscDebugBreakpointFunction } from 'react-icons/vsc';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';

import styled from './styles.module.scss';
import ShippingInput from '../Input/ShippingInput';
import { countries } from '@/data/countries';
import SingularSelect from '../Select/SingularSelect';
import {
  saveAddress,
  changeDefaultAddress,
  deleteAddress,
} from '@/utils/request';
import Popup from '../Popup';
import Router from 'next/router';

const initialValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  state: '',
  city: '',
  zipCode: '',
  address1: '',
  address2: '',
  country: '',
};

const Shipping = ({ user, addresses, setAddresses, profile }) => {
  const [shipping, setShipping] = useState(initialValues);
  const [visible, setVisible] = useState(user?.address.length === 0);

  const {
    firstName,
    lastName,
    phoneNumber,
    state,
    city,
    zipCode,
    address1,
    address2,
    country,
  } = shipping;

  const validate = Yup.object({
    firstName: Yup.string()
      .required('First name is required.')
      .min(2, 'First name must be at least 2 characters.')
      .max(20, 'First name must be less than 20 characters.'),
    lastName: Yup.string()
      .required('Last name is required.')
      .min(2, 'Last name must be at least 2 characters.')
      .max(20, 'Last name must be less than 20 characters.'),
    phoneNumber: Yup.string()
      .required('Phone number is required.')
      .min(3, 'Phone number must be at least 3 characters.')
      .max(30, 'Phone number must be less than 20 characters.'),
    state: Yup.string()
      .required('State name is required.')
      .min(2, 'State name should contain 2-60 characters.')
      .max(60, 'State name should contain 2-60 characters.'),
    city: Yup.string()
      .required('City name is required.')
      .min(2, 'City name should contain 2-60 characters.')
      .max(60, 'City name should contain 2-60 characters.'),
    zipCode: Yup.string()
      .required('ZipCode/Postal is required.')
      .min(2, 'ZipCode/Postal should contain 2-30 characters.')
      .max(30, 'ZipCode/Postal should contain 2-30 characters.'),
    address1: Yup.string()
      .required('Address Line 1 is required.')
      .min(5, 'Address Line 1 should contain 5-100 characters.')
      .max(100, 'Address Line 1 should contain 5-100 characters.'),
    address2: Yup.string()
      .min(5, 'Address Line 2 should contain 5-100 characters.')
      .max(100, 'Address Line 2 should contain 5-100 characters.'),
    country: Yup.string().required('Country name is required.'),
  });

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setShipping({ ...shipping, [name]: value });
  };

  const selectHandleChange = (name, value) => {
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const saveShippingHandler = async () => {
    const res = saveAddress(shipping);
    console.log(res);
    // setAddresses(res);
    setShipping(initialValues);
    Swal.fire({
      icon: 'success',
      title: 'Успешно!',
      text: 'Ваш новый адрес был успешно добавлен.',
      showConfirmButton: false,
      timer: 2000,
    });
    Router.reload();
  };

  // const changeDefaultAddressHandler = () => {
  //   Popup(
  //     'Are you sure?',
  //     "We'll set this address as your default address!",
  //     'question',
  //     'Yes',
  //     async () => {
  //       const res = changeDefaultAddress();
  //       // setAddresses(res);
  //     },
  //     'Done!',
  //     'Set new default address successfully.'
  //   );
  // };

  // const deleteAddressHandler = () => {
  //   Popup(
  //     'Are you sure?',
  //     "You won't be able to revert this!",
  //     'warning',
  //     'Yes, delete it!',
  //     async () => {
  //       await deleteAddress();
  //       // setAddresses(res);
  //     },
  //     'Done!',
  //     'Address has been deleted.'
  //   );
  // };

  return (
    <div className={`${styled.shipping} ${styled.card}`}>
      {!profile ? (
        <h2 className={styled.heading}>Адрес Доставки</h2>
      ) : (
        <h1 className={styled.profileHeading}>Мои Адреса</h1>
      )}
      <div className={styled.shipping__addresses}>
        <div
          className={`${styled.shipping__address} ${
            addresses?.active && styled?.active
          }`}
        >
          <div className={styled.shipping__address_name}>
            {addresses?.firstName} {addresses?.lastName}
          </div>

          <div className={styled.shipping__address_addressLine}>
            <VscDebugBreakpointFunction />
            <p>
              Адресс <span>: {addresses?.address1}</span>
            </p>
          </div>

          <div className={styled.shipping__address_addressLine}>
            <VscDebugBreakpointFunction />{' '}
            <p>
              Номер Телефона <span>: {addresses?.phoneNumber}</span>
            </p>
          </div>

          <div className={styled.shipping__address_addressLine}>
            <VscDebugBreakpointFunction />{' '}
            <p>
              Почтовый Индекс <span>: {addresses?.zipCode}</span>
            </p>
          </div>

          {/* {addresses?.active && ( */}
          <span className={styled.default}>По умолчанию</span>
          {/* )} */}
          {/* {!addresses.active && ( */}
          {/* <div className={styled.shipping__address_actions}> */}
          {/* <Button
                variant='contained'
                className={styled.shipping__address_set}
                onClick={() => changeDefaultAddressHandler()}
              >
                Set as default
              </Button> */}

          {/* <Button
              variant='contained'
              color='error'
              className={styled.shipping__address_remove}
              onClick={() => deleteAddressHandler()}
            >
              Delete
            </Button>
          </div> */}
          {/* )} */}
        </div>
        {/* ))} */}
      </div>
      <div className={styled.shipping__address_add}>
        <Button
          variant='contained'
          className={`${styled.hide_show} ${
            visible ? styled.close : styled.open
          } `}
          onClick={() => setVisible((prev) => !prev)}
        >
          {visible ? (
            <span>
              Закрыть форму адресса <BsFillCaretDownFill />
            </span>
          ) : (
            <span>
              Изменить Адресс <BsFillCaretUpFill />
            </span>
          )}
        </Button>
      </div>

      {visible && (
        <Formik
          enableReinitialize
          initialValues={{
            firstName,
            lastName,
            phoneNumber,
            state,
            city,
            zipCode,
            address1,
            address2,
            country,
          }}
          validationSchema={validate}
          onSubmit={saveShippingHandler}
        >
          {(form) => (
            <Form>
              <div className={styled.shipping__line}>
                <ShippingInput
                  required
                  id='firstName'
                  name='firstName'
                  label='First name'
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
                <ShippingInput
                  required
                  id='lastName'
                  name='lastName'
                  label='Last name'
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
              </div>

              <div className={styled.shipping__line}>
                <ShippingInput
                  required
                  id='phoneNumber'
                  name='phoneNumber'
                  label='Phone number'
                  fullWidth
                  onChange={changeInputHandler}
                  icon='number'
                />
                <ShippingInput
                  required
                  id='zipCode'
                  name='zipCode'
                  label='Zip / Postal code'
                  fullWidth
                  onChange={changeInputHandler}
                  icon='number'
                />
              </div>

              <div className={styled.shipping__line}>
                <ShippingInput
                  required
                  id='city'
                  name='city'
                  label='City'
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
                <ShippingInput
                  required
                  id='state'
                  name='state'
                  label='State/Province/Region'
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
              </div>

              <div className={styled.shipping__fullLine}>
                <SingularSelect
                  data={countries}
                  value={country}
                  name='country'
                  handleChange={selectHandleChange}
                  placeholder='Country *'
                />
              </div>

              <div className={styled.shipping__fullLine}>
                <ShippingInput
                  required
                  id='address1'
                  name='address1'
                  label='Address line 1'
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
              </div>
              <div className={styled.shipping__fullLine}>
                <ShippingInput
                  id='address2'
                  name='address2'
                  label='Address line 2'
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
              </div>

              <FormControlLabel
                control={
                  <Checkbox color='primary' name='saveAddress' value='yes' />
                }
                label='Использовать этот адресс для оплаты'
              />

              <div className={styled.shipping__button}>
                <Button type='submit' variant='contained'>
                  Сохранить адресс
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Shipping;
