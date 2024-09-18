import { Button } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { MdAssignmentAdd } from 'react-icons/md';
import styled from './styles.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import AdminInput from '@/components/Input/AdminInput';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/router';

const Create = ({ setCategories }) => {
  const router = useRouter();
  const [name, setName] = useState('');

  const validate = Yup.object({
    name: Yup.string()
      .required('Имя категории обязательно.')
      .min(2, 'Имя категории должно быть от 2 до 30 символов.')
      .max(30, 'Имя категории должно быть от 2 до 30 символов.'),
  });

  const inputChangeHandler = (e) => setName(e.target.value);

  const submitHandler = async (values, { resetForm }) => {
    try {
      const { data } = await axios.post('/api/admin/category', { name });
      setCategories(data.categories); // Update the categories state immediately
      console.log(data);

      setName('')
      toast.success(data.message);

    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ name }}
        validationSchema={validate}
        onSubmit={submitHandler}
      >
        {(formik) => (
          <Form>
            <div className={styled.header}>Добавить категорию</div>
            <AdminInput
              type='text'
              label='Имя категории'
              name='name'
              placeholder='Ex: Smartphone, Accessories, ...'
              onChange={inputChangeHandler}
            />
            <div className={`${styled.btn} ${styled.form_btn}`}>
              <Button
                variant='contained'
                type='submit'
                startIcon={<MdAssignmentAdd />}
                color='info'
              >
                Добавить категорию
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Create;
