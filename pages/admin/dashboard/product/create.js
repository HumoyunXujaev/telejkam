import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { MdAssignmentAdd } from 'react-icons/md';

import styled from '@/styles/CreateProduct.module.scss';
import Layout from '@/components/Admin/Layout';
import SingularSelect from '@/components/Select/SingularSelect';
import MultipleSelect from '@/components/Select/MultipleSelect';
import AdminInput from '@/components/Input/AdminInput';
import Images from '@/components/Admin/CreateProduct/Images';
import Colors from '@/components/Admin/CreateProduct/Colors';
import Sizes from '@/components/Admin/CreateProduct/Sizes';
import StyledDotLoader from '@/components/Loaders/DotLoader';
import { uploadHandler } from '@/utils/request';
import dataURItoBlob from '@/utils/dataURItoBlob';
import db from '@/utils/db';
import { Category } from '@/models/Category';
import Styles from '@/components/Admin/CreateProduct/Styles';

const initialState = {
  name: '',
  description: '',
  brand: '',
  label: '',
  sku: '',
  discount: '',
  images: [],
  description_images: [],
  category: '',
  subCategories: [],
  color: {
    color: '',
    image: '',
  },
  sizes: [
    {
      size: '',
      qty: '',
      price: '',
      price_description: '',
    },
  ],
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Название продукта обязательно')
    .max(300, 'Название продукта должно быть не более 300 символов'),
  brand: Yup.string().required('Бренд обязателен'),
  label: Yup.string().required('Метка обязательна'),
  category: Yup.string().required('Категория обязательна'),
  sku: Yup.string().required('SKU обязателен'),
  description: Yup.string().required('Описание обязательно'),
});

const CustomErrorToast = ({ errors }) => (
  <div>
    <strong>Пожалуйста, исправьте следующие ошибки:</strong>
    <ul>
      {errors.split('\n').map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  </div>
);

const showErrorToast = (errors) => {
  toast.error(<CustomErrorToast errors={errors} />, {
    position: 'top-right',
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export default function CreateProductPage({ categories }) {
  const [product, setProduct] = useState(initialState);
  const [subs, setSubs] = useState([]);
  const [colorImage, setColorImage] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (product.category) {
      // Здесь мы по-прежнему используем API для получения подкатегорий
      // Так как это зависит от выбранной категории и может быть динамическим
      axios
        .get(`/api/admin/subcategory?category=${product.category}`)
        .then(({ data }) => {
          setSubs(data);
        })
        .catch((error) => {
          console.error('Error fetching subcategories:', error);
          toast.error('Не удалось загрузить подкатегории');
        });
    }
  }, [product.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const selectHandleChange = (name, value) => {
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const validateProduct = (values) => {
    const errors = [];

    if (images.length < 1) {
      errors.push('Не загружено ни одной фотографии продукта (Шаг 2)');
    }

    if (values.color.color === '' && values.color.image === '') {
      errors.push('Не выбран основной цвет продукта (Шаг 3)');
    }

    if (values.sizes.length === 0) {
      errors.push('Не добавлено ни одного размера (Шаг 5)');
    } else {
      values.sizes.forEach((size, index) => {
        if (
          size.size === '' ||
          size.price === '' ||
          size.price_description === '' ||
          size.qty === ''
        ) {
          errors.push(`Размер #${index + 1} заполнен не полностью (Шаг 5)`);
        }
      });
    }

    if (values.subCategories.length === 0) {
      errors.push('Не выбрано ни одной подкатегории');
    }

    return errors;
  };

  const createProductHandler = async (values, { setSubmitting }) => {
    try {
      setLoading(true);

      const errors = validateProduct(values);
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      let uploaded_images = [];
      let style_image = '';

      if (images.length > 0) {
        const formData = new FormData();
        formData.append('path', 'product images');
        images.forEach((img) => {
          formData.append('file', dataURItoBlob(img));
        });
        uploaded_images = await uploadHandler(formData);
      }

      if (values.color.image) {
        const formData = new FormData();
        formData.append('path', 'product style images');
        formData.append('file', dataURItoBlob(values.color.image));
        const cloudinary_style_img = await uploadHandler(formData);
        style_image = cloudinary_style_img[0].url;
      }

      const { data } = await axios.post('/api/admin/product', {
        ...values,
        images: uploaded_images,
        color: {
          image: style_image,
          color: values.color.color,
        },
      });

      toast.success(data?.message || 'Продукт успешно создан');
      router.push('/admin/dashboard/product/all');
    } catch (error) {
      showErrorToast(error.message || 'Произошла ошибка при создании продукта');
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {loading && <StyledDotLoader />}
      <div className={styled.header}>Добавить продукт</div>
      <Formik
        initialValues={product}
        validationSchema={validationSchema}
        onSubmit={createProductHandler}
      >
        {(formik) => (
          <Form>
            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 1:</span> Выберите категорию и подкатегорию
                (обязательно)
              </div>
              <SingularSelect
                name='category'
                value={formik.values.category}
                placeholder='Категория'
                data={categories}
                handleChange={(value) =>
                  formik.setFieldValue('category', value)
                }
              />
              <MultipleSelect
                value={formik.values.subCategories}
                data={subs}
                header='Подкатегории'
                name='subCategories'
                handleChange={(value) =>
                  formik.setFieldValue('subCategories', value)
                }
              />
            </div>

            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 2 :</span> &nbsp;Загрузите фотки (обязательно)
              </div>
              <Images
                name='imageInputFile'
                header=''
                text='добавить фото'
                images={images}
                setImages={setImages}
                setColorImage={setColorImage}
              />
            </div>

            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 3 :</span> &nbsp;Выберите цвет продукта (обязательно)
              </div>

              <Colors
                name='color'
                product={product}
                setProduct={setProduct}
                colorImage={colorImage}
                setColorImage={setColorImage}
                images={images}
              />
              <div className={styled.form__row_flex}>
                {product.color.color && (
                  <div className={styled.color_span}>
                    <span>
                      Цвет&nbsp;
                      <b style={{ fontWeight: 600 }}>{product.color.color}</b>
                      &nbsp;был выбран
                    </span>
                    <span style={{ background: product.color.color }}></span>
                  </div>
                )}
              </div>
            </div>

            <div className={styled.form__row_section}>
              <Styles
                product={product}
                setProduct={setProduct}
                colorImage={colorImage}
              />
              {product.color.image && (
                <img
                  src={product.color.image}
                  className={styled.image_span}
                  alt=''
                />
              )}
            </div>

            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 4 :</span> &nbsp;Базовая информация (обязательно)
              </div>
              <AdminInput
                type='text'
                label='Name'
                name='name'
                placeholder='имя продукта'
                onChange={handleChange}
                className='fixSpan'
              />
              <div className={styled.form__row_flex}>
                <AdminInput
                  type='text'
                  label='SKU'
                  name='sku'
                  placeholder='номер продукта'
                  onChange={handleChange}
                  className='fixSpan'
                />
                <AdminInput
                  type='text'
                  label='Description'
                  name='description'
                  placeholder='описание'
                  onChange={handleChange}
                  className='fixSpan'
                />
              </div>
              <div className={styled.form__row_flex}>
                <AdminInput
                  type='text'
                  label='Brand'
                  name='brand'
                  placeholder='бренд'
                  onChange={handleChange}
                  className='fixSpan'
                />
                <AdminInput
                  type='text'
                  label='Label'
                  name='label'
                  placeholder='(хиты,новинки,распродажа и т.д.)'
                  onChange={handleChange}
                  className='fixSpan'
                />
                <AdminInput
                  type='text'
                  label='Discount'
                  name='discount'
                  placeholder='Скидка %'
                  onChange={handleChange}
                  className='fixSpan'
                />
              </div>
            </div>

            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 5 :</span> &nbsp;Выберите размеры, количество и цены
                (обязательно)
              </div>
              <Sizes
                sizes={product.sizes}
                product={product}
                setProduct={setProduct}
              />
            </div>

            {/* <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 6 :</span> &nbsp;Остальные детали (желательно)
              </div>
              <Details
                details={product.details}
                product={product}
                setProduct={setProduct}
              />
            </div>

            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 7 :</span> &nbsp;Частые вопросы (желательно)
              </div>

              <Questions
                questions={product.questions}
                product={product}
                setProduct={setProduct}
              />
            </div> */}
            <div className={`${styled.btn} ${styled.submit_btn}`}>
              <Button
                variant='contained'
                type='submit'
                startIcon={<MdAssignmentAdd />}
                color='info'
                disabled={formik.isSubmitting || loading}
              >
                Добавить продукт
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    await db.connectDb();
    const categories = await Category.find().lean();
    await db.disConnectDb();

    return {
      props: {
        categories: JSON.parse(JSON.stringify(categories)),
      },
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      props: {
        categories: [],
      },
    };
  }
}
