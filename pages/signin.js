/* eslint-disable @next/next/no-img-element */
import LoginInput from '@/components/Input/LoginInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineBackward } from 'react-icons/ai';
import { BsCheckCircleFill } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md';
import { useRouter } from 'next/router';
import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from 'next-auth/react';
import axios from 'axios';

import styled from '../styles/Signin.module.scss';
import HasIconButton from '@/components/Button/HasIconButton';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import StyledDotLoader from '@/components/Loaders/DotLoader';

const initialValues = {
  login_email: '',
  login_password: '',
  full_name: '',
  email: '',
  password: '',
  confirm_password: '',
  success: '',
  error: '',
  login_error: '',
};

const SigninPage = ({ providers, callbackUrl, csrfToken }) => {
  const Router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialValues);
  const {
    login_email,
    login_password,
    full_name,
    email,
    password,
    confirm_password,
    success,
    error,
    login_error,
  } = user;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginValidation = Yup.object({
    login_email: Yup.string()
      .required('Это поле обязательно для заполнения(почта)')
      .email('Введите действительный адрес электронной почты'),
    login_password: Yup.string().required(
      'Это поле обязательно для заполнения(пароль)'
    ),
  });

  const registerValidation = Yup.object({
    full_name: Yup.string()
      .required('Ваше Имя?')
      .min(2, 'Ваше имя должно быть от 2 до 16 символов')
      .max(16, 'Ваше имя должно быть от 2 до 16 символов')
      .matches(/^[aA-zZ]/, 'Цифры и специальные символы не допускаются'),
    email: Yup.string()
      .required('Ваш аккаунт нуждается в почте')
      .email('Введите действительный адрес электронной почты'),
    password: Yup.string()
      .required('Пароль обязателен для заполнения')
      .min(6, 'Пароль должен быть не менее 6 символов')
      .max(36, 'Пароль должен быть не более 36 символов'),
    confirm_password: Yup.string()
      .required('Подтвердите пароль')
      .oneOf([Yup.ref('password')], 'Пароли не совпадают'),
  });

  const signUpHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/signup', {
        full_name,
        email,
        password,
      });
      setUser({ ...user, error: '', success: data.message });
      setLoading(false);
      setTimeout(async () => {
        let options = {
          redirect: false,
          email: email,
          password: password,
        };

        await signIn('credentials', options);
        Router.push('/');
      }, 2000);
    } catch (error) {
      setLoading(false);
      setUser({ ...user, success: '', error: error.response.data.message });
    }
  };

  const signInHandler = async () => {
    setLoading(true);
    let options = {
      redirect: false,
      email: login_email,
      password: login_password,
    };

    const res = await signIn('credentials', options);

    setUser({ ...user, success: '', error: '' });
    setLoading(false);

    if (res?.error) {
      setLoading(false);
      setUser({ ...user, login_error: res?.error });
    } else {
      return Router.push('/admin/dashboard/');
    }
  };

  return (
    <>
      {loading && <StyledDotLoader />}
      <Header />
      <div className={styled.login}>
        <div className={styled.login__container}>
          <div className={styled.login__header}>
            <div onClick={() => Router.back()} className={styled.back__svg}>
              <AiOutlineBackward />
            </div>
            <span>
              Мы рады видеть вас снова!
              <Link href='/browse'>Пойти в Покупки</Link>
            </span>
          </div>
          <div className={styled.login__form}>
            <h1>Войти</h1>
            <p>Войдите в свой аккаунт</p>
            <Formik
              //reset the form if initialValues changes
              enableReinitialize
              //initial field values of the form
              initialValues={{ login_email, login_password }}
              //A Yup schema or a function that returns a Yup schema. This is used for validation
              validationSchema={loginValidation}
              onSubmit={() => {
                signInHandler();
              }}
            >
              {(form) => (
                <Form method='post' action='/api/auth/signin/email'>
                  <input
                    name='csrfToken'
                    type='hidden'
                    defaultValue={csrfToken}
                  />
                  <LoginInput
                    icon='email'
                    placeholder='Ваш адресс почты'
                    id='login_email'
                    name='login_email'
                    label='Email'
                    type='email'
                    onChange={inputChangeHandler}
                  />
                  <LoginInput
                    label='Password'
                    icon='password'
                    id='login_password'
                    placeholder='Ваш пароль'
                    name='login_password'
                    type='password'
                    onChange={inputChangeHandler}
                  />
                  <div className={styled.forgot}>
                    <Link href='/auth/forgot'>Забыли пароль?</Link>
                  </div>
                  <div className={styled.signInBtnWrap}>
                    <HasIconButton type='submit'>Войти</HasIconButton>
                  </div>
                  {login_error && (
                    <span className={styled.error}>
                      <MdCancel /> {login_error}
                    </span>
                  )}
                </Form>
              )}
            </Formik>
            <div className={styled.login__socials}>
              <span className={styled.or}>Или продолжить с</span>
              <div className={styled.login__socials_wrap}>
                {providers.map((provider) => {
                  if (provider.name === 'Credentials') {
                    return;
                  }
                  return (
                    <div key={provider.id}>
                      <button
                        className={styled.social__btn}
                        onClick={() => signIn(provider.id)}
                      >
                        <img
                          src={`/icons/${provider.id}.png`}
                          alt={provider.name}
                        />
                        <p>Войти с {provider.name}</p>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={styled.login__container}>
          <div className={styled.login__form}>
            <h2>Регистрация</h2>
            <p>Зарегестрируйтесь чтобы получить права на аккаунт</p>
            <Formik
              //reset the form if initialValues changes
              enableReinitialize
              //initial field values of the form
              initialValues={{ full_name, email, password, confirm_password }}
              //A Yup schema or a function that returns a Yup schema. This is used for validation
              validationSchema={registerValidation}
              onSubmit={() => {
                signUpHandler();
              }}
            >
              {(form) => (
                <Form>
                  <LoginInput
                    icon='user'
                    placeholder='Ваше полное имя'
                    id='full_name'
                    name='full_name'
                    label='Full name'
                    type='text'
                    onChange={inputChangeHandler}
                  />
                  <LoginInput
                    label='Email'
                    icon='email'
                    id='email'
                    placeholder='Ваш адресс почты'
                    name='email'
                    type='email'
                    onChange={inputChangeHandler}
                  />
                  <LoginInput
                    label='Password'
                    icon='password'
                    id='password'
                    placeholder='Ваш пароль'
                    name='password'
                    type='password'
                    onChange={inputChangeHandler}
                  />
                  <LoginInput
                    label='Repeat password'
                    icon='repeat'
                    id='confirm_password'
                    placeholder='Повторите пароль'
                    name='confirm_password'
                    type='password'
                    onChange={inputChangeHandler}
                  />
                  <div className={styled.signUpBtnWrap}>
                    <HasIconButton type='submit'>
                      Зарегестрироваться
                    </HasIconButton>
                  </div>
                </Form>
              )}
            </Formik>
            <div>
              {success && (
                <span className={styled.success}>
                  {' '}
                  <BsCheckCircleFill />
                  {success}
                </span>
              )}
            </div>
            <div>
              {error && (
                <span className={styled.error}>
                  {' '}
                  <MdCancel />
                  {error}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default SigninPage;

export async function getServerSideProps(context) {
  const { req, query } = context;
  const { callbackUrl } = query;

  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: callbackUrl,
      },
    };
  }

  const csrfToken = await getCsrfToken(context);

  const providers = Object.values(await getProviders());

  return {
    props: {
      providers,
      csrfToken,
      callbackUrl,
    },
  };
}
