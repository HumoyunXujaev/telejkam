/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { MdAssignmentAdd } from 'react-icons/md';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

import styled from '@/styles/CreateProduct.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/Admin/Layout';
import { Category } from '@/models/Category';
import { SubCategory } from '@/models/SubCategory';
import { Product } from '@/models/Product';
import db from '@/utils/db';
import SingularSelect from '@/components/Select/SingularSelect';
import MultipleSelect from '@/components/Select/MultipleSelect';
import AdminInput from '@/components/Input/AdminInput';
import Images from '@/components/Admin/CreateProduct/Images';
// import Colors from '@/components/Admin/CreateProduct/Colors';
// import Styles from '@/components/Admin/CreateProduct/Styles';
import Sizes from '@/components/Admin/CreateProduct/Sizes';
import Details from '@/components/Admin/CreateProduct/Details';
import Questions from '@/components/Admin/CreateProduct/Questions';
import Swal from 'sweetalert2';
import dataURItoBlob from '@/utils/dataURItoBlob';
import { uploadHandler } from '@/utils/request';
import StyledDotLoader from '@/components/Loaders/DotLoader';
import Router, { useRouter } from 'next/router';

const initialState = {
  name: '',
  description: '',
  brand: '',
  label: '',
  sku: '',
  discount: '',
  images: [],
  description_images: [],
  parent: '',
  category: '',
  subCategories: [],
  // color: {
  //   color: '',
  //   image: '',
  // },
  sizes: [
    {
      size: '',
      qty: '',
      price: '',
      price_description: '',
    },
  ],
  details: [
    {
      name: '',
      value: '',
    },
  ],
  questions: [
    {
      question: '',
      answer: '',
    },
  ],
  shippingFee: '',
};

export default function CreateProductPage({ categories, allSubCategories }) {
  const [product, setProduct] = useState(initialState);
  // const [subs, setSubs] = useState([]);
  // const [colorImage, setColorImage] = useState('');
  const [images, setImages] = useState([]);
  const [description_images, setDescription_images] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // на русском
  const validate = Yup.object({
    name: Yup.string()
      .required('Пожалуйста, добавьте название')
      .max(300, 'Название продукта должно быть от 10 до 300 символов.'),
    brand: Yup.string().required('Пожалуйста, добавьте бренд'),
    label: Yup.string().required('Пожалуйста, добавьте метку'),
    category: Yup.string().required('Пожалуйста, выберите категорию.'),
    sku: Yup.string().required('Пожалуйста, добавьте sku/номер'),
    // color: Yup.string().required('Пожалуйста, добавьте цвет'),
    description: Yup.string().required('Пожалуйста, добавьте описание'),
  });

  // useEffect(() => {
  //   axios
  //     .get(`/api/admin/subcategory?category=${product.category}`)
  //     .then(({ data }) => {
  //       setSubs(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [product.category]);

  const filteredSubCategories = useMemo(() => {
    return allSubCategories.filter((sub) => sub.parent === product.category);
  }, [allSubCategories, product.category]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const selectHandleChange = (name, value) => {
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const createProductHandler = async (e) => {
    if (images.length < 1) {
      toast.error('Пожалуйста загрузите хотябы одну фотку продукта (Шаг 2).');
      Swal.fire({
        icon: 'error',
        title: 'Не найдено картинок!',
        text: 'Пожалуйста загрузите хотябы одну фотку продукта (Шаг 2).',
      });
      return;
    }

    // if (product.color.color == '' && product.color.image == '') {
    //   toast.error('Пожалуйста выберите основной цвет продукта (Шаг 3).');

    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Не найдено цвета!',
    //     text: 'Пожалуйста выберите основной цвет продукта (Шаг 3).',
    //   });
    //   return;
    // }

    for (let i = 0; i < product.sizes.length; i++) {
      if (
        product.sizes[i].size == '' ||
        product.sizes[i].price == '' ||
        product.sizes[i].price_description == '' ||
        product.sizes[i].qty == ''
      ) {
        toast.error('Пожалуйста, заполните все поля размеров (Шаг 5).');

        Swal.fire({
          icon: 'error',
          title: 'Избыток информации о размерах!',
          text: 'Пожалуйста, заполните все поля размеров (Шаг 5).',
        });
        setLoading(false);

        return;
      }
    }

    setLoading(true);

    let uploaded_images = [];
    let style_image = '';

    // if (images) {
    //   let temp = images.map((img) => dataURItoBlob(img));
    //   const path = 'product images';
    //   let formData = new FormData();
    //   formData.append('path', path);
    //   temp.forEach((image) => {
    //     formData.append('file', image);
    //   });
    //   //Upload ảnh product lên Cloudinary và nhận về mảng chứa các URL
    //   uploaded_images = await uploadHandler(formData);
    // }
    if (images) {
      try {
        let temp = images.map((img) => dataURItoBlob(img));
        const path = 'product images';
        let formData = new FormData();
        formData.append('path', path);

        // This is key - make sure you're correctly appending each file
        temp.forEach((image) => {
          // Check if image is valid before appending
          if (image && image instanceof Blob) {
            formData.append('file', image);
          }
        });

        // Check if formData actually contains files
        if (formData.has('file')) {
          uploaded_images = await uploadHandler(formData);
        } else {
          throw new Error('No files were chosen.');
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
        setLoading(false);
        return;
      }
    }

    // if (product.color.image) {
    //   let temp = dataURItoBlob(product.color.image);
    //   const path = 'product style images';
    //   let formData = new FormData();
    //   formData.append('path', path);
    //   formData.append('file', temp);
    //   //Upload Color image lên Cloudinary và nhận về URL
    //   let cloudinary_style_img = await uploadHandler(formData);
    //   style_image = cloudinary_style_img[0].url;
    // }

    try {
      const { data } = await axios.post('/api/admin/product', {
        ...product,
        images: uploaded_images,
        // color: {
        //   image: style_image,
        //   color: product.color.color,
        // },
        subCategories: product.subCategories,
      });

      console.log('subcategorqs:', product.subCategories);
      setLoading(false);

      toast.success(data?.message || 'успешно');
      router.push('/admin/dashboard/product/all');

      // window.location.reload(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message ||
          'Произошла ошибка при создании продукта (проверьте все)'
      );
      // toast.error(error.response.data.message);
    }
  };

  return (
    <Layout>
      {loading && <StyledDotLoader />}
      <div className={styled.header}>Добавить продукт</div>
      <Formik
        enableReinitialize
        initialValues={{
          name: product.name,
          brand: product.brand,
          label: product.label,
          description: product.description,
          category: product.category,
          subCategories: product.subCategories,
          parent: product.parent,
          sku: product.sku,
          discount: product.discount,
          // color: product.color.color,
          imageInputFile: '',
          styleInput: '',
        }}
        validationSchema={validate}
        validator={() => ({})}
        onSubmit={createProductHandler}
      >
        {(formik) => (
          <Form>
            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 1 :</span> &nbsp;Выберите категорию и подкатегорию
                (обязательно)
              </div>
              <div className={styled.form__row_flex}>
                <SingularSelect
                  name='category'
                  value={product.category}
                  placeholder='Категория'
                  data={categories}
                  header='Select a category'
                  handleChange={selectHandleChange}
                  disabled={product.parent}
                />
              </div>

              <MultipleSelect
                value={product.subCategories}
                data={filteredSubCategories}
                header='подкатегории'
                name='subCategories'
                handleChange={(e) => {
                  // Обработчик для выбора подкатегорий
                  setProduct({ ...product, subCategories: e.target.value });
                }}
                // handleChange={handleChange}
                disabled={product.parent || !product.category}
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
                // setColorImage={setColorImage}
              />
            </div>

            <div className={styled.form__row_section}>
              {/* <div className={styled.subHeader}>
                <span>Шаг 3 :</span> &nbsp;Выберите цвет продукта (обязательно)
              </div> */}

              {/* <Colors
                name='color'
                product={product}
                setProduct={setProduct}
                colorImage={colorImage}
                setColorImage={setColorImage}
                images={images}
              /> */}
              {/* <div className={styled.form__row_flex}>
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
              </div> */}
            </div>

            {/* <div className={styled.form__row_section}> */}
            {/* <Styles
                product={product}
                setProduct={setProduct}
                colorImage={colorImage}
              /> */}
            {/* {product.color.image && (
                <img
                  src={product.color.image}
                  className={styled.image_span}
                  alt=''
                />
              )} */}
            {/* </div> */}

            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 4 :</span> &nbsp;Базовая информация (обязательно)
              </div>
              <AdminInput
                type='text'
                label='Имя'
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
                  label='Описание'
                  name='description'
                  placeholder='описание'
                  onChange={handleChange}
                  className='fixSpan'
                />
              </div>
              <div className={styled.form__row_flex}>
                <AdminInput
                  type='text'
                  label='Бренд'
                  name='brand'
                  placeholder='бренд'
                  onChange={handleChange}
                  className='fixSpan'
                />
                <AdminInput
                  type='text'
                  label='Метка'
                  name='label'
                  placeholder='(хиты,новинки,распродажа и т.д.)'
                  onChange={handleChange}
                  className='fixSpan'
                />
                <AdminInput
                  type='text'
                  label='Скидка'
                  name='discount'
                  placeholder='Скидка % (1-100)'
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

export async function getServerSideProps(ctx) {
  await db.connectDb();
  const categories = await Category.find().lean();
  const allSubCategories = await SubCategory.find().lean();

  db.disConnectDb();

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      allSubCategories: JSON.parse(JSON.stringify(allSubCategories)),
    },
  };
}
