/* eslint-disable @next/next/no-img-element */
import { use, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import * as Icon from 'react-feather';

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
import { useTranslation } from 'next-i18next';

const initialValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  state: '',
  city: '',
  address1: '',
  address2: '',
  country: '',
};

const Shipping = ({ user, addresses, setAddresses, profile }) => {
  const { t } = useTranslation();

  const [shipping, setShipping] = useState(initialValues);
  const [visible, setVisible] = useState(user?.address.length === 0);

  const {
    firstName,
    lastName,
    phoneNumber,
    state,
    city,
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
    saveAddress(shipping);
    setShipping(initialValues);
    Router.reload();

    Swal.fire({
      icon: 'success',
      title: 'Успешно!',
      text: 'Ваш новый адрес был успешно добавлен.',
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // if no address is saved or address is null or address length < 1, show the form to add a new address by default
  // if no address set visible to true
  useEffect(() => {
    if (
      !addresses ||
      addresses.length < 1 ||
      addresses === null ||
      addresses === undefined
    ) {
      setVisible(true);
    }
  }, [addresses]);

  return (
    <div className={`${styled.shipping} ${styled.card}`}>
      <h2 className={styled.heading}>{t('address')}</h2>

      {addresses ? (
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
              <Icon.Circle />
              <p>
                {t('address')} <span>: {addresses?.address1}</span>
              </p>
            </div>

            <div className={styled.shipping__address_addressLine}>
              <Icon.Circle />{' '}
              <p>
                {t('phone')} <span>: {addresses?.phoneNumber}</span>
              </p>
            </div>

            <span className={styled.default}>По умолчанию</span>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ textAlign: 'center' }}>{t('no_saved_address')}</p>
        </div>
      )}

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
              <Icon.ChevronUp />
            </span>
          ) : addresses || !addresses === null ? (
            <span>
              {t('redact_address')} <Icon.ChevronDown />
            </span>
          ) : (
            <span>
              {t('add_address')} <Icon.ChevronDown />
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
                  label={t('first_name')}
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
                <ShippingInput
                  required
                  id='lastName'
                  name='lastName'
                  label={t('last_name')}
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
                  label={t('phone')}
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
                  label={t('city')}
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
                <ShippingInput
                  required
                  id='state'
                  name='state'
                  label={t('state')}
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
                  placeholder={t('country')}
                />
              </div>

              <div className={styled.shipping__fullLine}>
                <ShippingInput
                  required
                  id='address1'
                  name='address1'
                  label={t('address') + ' 1'}
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
              </div>
              <div className={styled.shipping__fullLine}>
                <ShippingInput
                  id='address2'
                  name='address2'
                  label={t('address') + ' 2'}
                  fullWidth
                  onChange={changeInputHandler}
                  icon='text'
                />
              </div>

              <FormControlLabel
                control={
                  <Checkbox color='primary' name='saveAddress' value='yes' />
                }
                label={t('use_for_pay')}
              />

              <div className={styled.shipping__button}>
                <Button type='submit' variant='contained'>
                  {t('save_address')}
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
