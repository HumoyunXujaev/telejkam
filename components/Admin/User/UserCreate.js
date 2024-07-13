import { Button, TextField, MenuItem } from '@mui/material';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import { MdAssignmentAdd } from 'react-icons/md';

import styled from './styles.module.scss';
import 'react-toastify/dist/ReactToastify.css';

import { toast } from 'react-toastify';
import axios from 'axios';

const UserCreate = ({ setUsers }) => {
  const validate = Yup.object({
    name: Yup.string()
      .required('Имя обязательно.')
      .min(2, 'Имя должно быть от 2 до 30 символов.')
      .max(30, 'Имя должно быть от 2 до 30 символов.'),
    email: Yup.string()
      .email('Неверный адрес электронной почты.')
      .required('Электронная почта обязательна.'),
    role: Yup.string().required('Пожалуйста, выберите роль.'),
    emailVerified: Yup.string().required(
      'Пожалуйста, выберите статус верификации электронной почты.'
    ),
    password: Yup.string()
      .required('Пароль обязателен.')
      .min(6, 'Пароль должен быть не менее 6 символов.'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать.')
      .required('Подтверждение пароля обязательно.'),
  });

  const submitHandler = async (values, { resetForm }) => {
    try {
      console.log('Submit handler invoked');
      console.log('Form values:', values);
      const { data } = await axios.post('/api/admin/user', values);
      console.log('Server response:', data);
      toast.success(data.message);
      //   clear form fields
      resetForm();
    } catch (error) {
      console.log('Error occurred:', error);
      toast.error(error.response?.data?.message || 'Произошла ошибка');
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: '',
          role: 'user',
          emailVerified: '',
          password: '',
          confirm_password: '',
        }}
        validationSchema={validate}
        onSubmit={submitHandler}
      >
        {({ values, handleChange, setFieldValue, errors, touched }) => (
          <Form>
            <div className={styled.header}>Добавить пользователя</div>
            <div className={styled.input_wrapper}>
              <TextField
                type='text'
                label='Имя'
                name='name'
                placeholder='Введите имя'
                value={values.name}
                onChange={handleChange}
                className='fixSpan'
                fullWidth
                margin='normal'
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />

              <TextField
                type='email'
                label='Электронная почта'
                name='email'
                placeholder='Введите электронную почту'
                value={values.email}
                onChange={handleChange}
                className='fixSpan'
                fullWidth
                margin='normal'
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />

              <TextField
                select
                label='Роль'
                name='role'
                value={values.role}
                onChange={(e) => setFieldValue('role', e.target.value)}
                className='fixSpan'
                fullWidth
                margin='normal'
                error={touched.role && !!errors.role}
                helperText={touched.role && errors.role}
              >
                <MenuItem value='user'>Пользователь</MenuItem>
                <MenuItem value='admin'>Администратор</MenuItem>
              </TextField>

              <TextField
                select
                label='Верифицировано'
                name='emailVerified'
                value={values.emailVerified}
                onChange={(e) => setFieldValue('emailVerified', e.target.value)}
                className='fixSpan'
                fullWidth
                margin='normal'
                error={touched.emailVerified && !!errors.emailVerified}
                helperText={touched.emailVerified && errors.emailVerified}
              >
                <MenuItem value='true'>Да</MenuItem>
                <MenuItem value='false'>Нет</MenuItem>
              </TextField>

              <TextField
                type='password'
                label='Пароль'
                name='password'
                placeholder='Введите пароль'
                value={values.password}
                onChange={handleChange}
                className='fixSpan'
                fullWidth
                margin='normal'
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />

              <TextField
                type='password'
                label='Подтвердите пароль'
                name='confirm_password'
                placeholder='Подтвердите пароль'
                value={values.confirm_password}
                onChange={handleChange}
                className='fixSpan'
                fullWidth
                margin='normal'
                error={touched.confirm_password && !!errors.confirm_password}
                helperText={touched.confirm_password && errors.confirm_password}
              />
            </div>

            <div className={`${styled.btn} ${styled.form_btn}`}>
              <Button
                variant='contained'
                type='submit'
                startIcon={<MdAssignmentAdd />}
                color='info'
              >
                Добавить пользователя
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UserCreate;
