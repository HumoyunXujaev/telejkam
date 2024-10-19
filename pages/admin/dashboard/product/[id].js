// /* eslint-disable @next/next/no-img-element */
// import { useEffect, useState } from 'react';
// import Router, { useRouter } from 'next/router';
// import axios from 'axios';
// import { Form, Formik } from 'formik';
// import * as Yup from 'yup';
// import { MdAssignmentAdd } from 'react-icons/md';
// import { Button } from '@mui/material';
// import { toast } from 'react-toastify';
// import styled from '@/styles/CreateProduct.module.scss';
// import 'react-toastify/dist/ReactToastify.css';
// import Layout from '@/components/Admin/Layout';
// import { Category } from '@/models/Category';
// import { Product } from '@/models/Product';
// import db from '@/utils/db';
// import SingularSelect from '@/components/Select/SingularSelect';
// import MultipleSelect from '@/components/Select/MultipleSelect';
// import AdminInput from '@/components/Input/AdminInput';
// import Images from '@/components/Admin/CreateProduct/Images';
// import Colors from '@/components/Admin/CreateProduct/Colors';
// import Styles from '@/components/Admin/CreateProduct/Styles';
// import Sizes from '@/components/Admin/CreateProduct/Sizes';
// import Details from '@/components/Admin/CreateProduct/Details';
// import Questions from '@/components/Admin/CreateProduct/Questions';
// import Swal from 'sweetalert2';
// import dataURItoBlob from '@/utils/dataURItoBlob';
// import { uploadHandler } from '@/utils/request';
// import StyledDotLoader from '@/components/Loaders/DotLoader';
// import Cookies from 'js-cookie';
// // initial state for the product
// const initialState = {
//   name: '',
//   description: '',
//   brand: '',
//   label: '',
//   sku: '',
//   discount: '',
//   images: [],
//   description_images: [],
//   parent: '',
//   category: '',
//   subCategories: [],
//   subProducts: [],
//   color: {
//     color: '',
//     image: '',
//   },
//   sizes: [
//     {
//       size: '',
//       qty: '',
//       price: '',
//       price_description: '',
//     },
//   ],
//   details: [
//     {
//       name: '',
//       value: '',
//     },
//   ],
//   questions: [
//     {
//       question: '',
//       answer: '',
//     },
//   ],
//   shippingFee: '',
// };

// export default function UpdateProductPage({ parents, categories }) {
//   const router = useRouter();
//   const { id } = router.query;

//   const [product, setProduct] = useState(initialState);
//   //   const [subs, setSubs] = useState([]);
//   const [colorImage, setColorImage] = useState('');
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [subs, setSubs] = useState([]);
//   const [newImages, setNewImages] = useState([]);

//   const token = Cookies.get('__Secure-next-auth.session-token'); // Cookie name as per your NextAuth config

//   console.log(token, '-token');
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const { data } = await axios.get(
//           `https://www.telejkam.uz/api/admin/product/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setProduct({
//           ...data,
//           category: data.category,
//           subCategories: data.subCategories[0],
//           images: data.subProducts
//             .map((s) => s.images.map((i) => i.url))
//             .flat(),
//           description_images: data.subProducts
//             .map((s) => s?.description_images?.map((i) => i?.url))
//             .flat(),
//           color: data.subProducts.map((s) => s.color),
//           sizes: data.subProducts.map((s) => s.sizes[0]),
//           discount: data.subProducts.map((s) => s.discount),
//           sku: data.subProducts.map((s) => s.sku),
//         });

//         console.log('Fetched product data:', data);
//         console.log('Subcategories:', data.subCategories[0]);
//       } catch (e) {
//         console.log('Error fetching product:', e);
//       }
//     };

//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   useEffect(() => {
//     if (product.category) {
//       axios
//         .get(`/api/admin/subcategory?category=${product.category}`)
//         .then(({ data }) => {
//           setSubs(data);
//           console.log('subs:', data);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   }, [product.category]);

//   const handleChange = (e) => {
//     const { value, name } = e.target;
//     setProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const selectHandleChange = (name, value) => {
//     setProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   // function to handle the form submission and update the product in the backend

//   const updateProductHandler = async (e) => {
//     if (product.images.length < 1) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Not found any images!',
//         text: 'Please upload at least 1 image of product (Step 2).',
//       });
//       return;
//     }

//     if (product.color.color == '' && product.color.image == '') {
//       Swal.fire({
//         icon: 'error',
//         title: 'Not found any main color!',
//         text: 'Please choose a main color for product (Step 3).',
//       });
//       return;
//     }

//     for (let i = 0; i < product.sizes.length; i++) {
//       if (
//         product.sizes[i].size == '' ||
//         product.sizes[i].price == '' ||
//         product.sizes[i].price_description == '' ||
//         product.sizes[i].qty == ''
//       ) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Lack of sizes infos!',
//           text: 'Please fill all informations on sizes (Step 5).',
//         });
//         setLoading(false);

//         return;
//       }
//     }

//     setLoading(true);
//     let uploaded_images = [];
//     let style_image = '';

//     if (newImages.length > 0) {
//       try {
//         let temp = newImages.map((img) => dataURItoBlob(img));
//         const path = 'product images';
//         let formData = new FormData();
//         formData.append('path', path);
//         temp.forEach((image) => {
//           formData.append('file', image);
//         });
//         uploaded_images = await uploadHandler(formData);
//         console.log(uploaded_images, 'uploaded images');
//       } catch (error) {
//         console.log('Error uploading images', error);
//         toast.error('Error uploading images', error);
//       }
//     }

//     if (product.color.image) {
//       try {
//         let temp = dataURItoBlob(product.color.image);
//         const path = 'product style images';
//         let formData = new FormData();
//         formData.append('path', path);
//         formData.append('file', temp);
//         let cloudinary_style_img = await uploadHandler(formData);
//         style_image = cloudinary_style_img[0].url;
//       } catch (error) {
//         toast.error('Error uploading style image', error);
//         console.log('error uploading style img', error);
//       }
//     }

//     try {
//       const data = {
//         ...product,
//         images: uploaded_images,
//         color: { image: style_image, color: product.color.color },
//         subCategories: product.subCategories,
//         sku: product.sku,
//         discount: product.discount,
//         sizes: product.sizes,
//       };
//       console.log('data:', data);
//       await axios
//         .put(`/api/admin/product/${id}`, data, {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })
//         .then((res) => {
//           console.log('Update product response:', res.data);
//           toast.success(res.data.message);

//           Router.push('/admin/dashboard/product/all');

//           // Handle success case if needed
//         })
//         .catch((error) => {
//           console.error('Error updating product:', error);
//           // Handle error case if needed
//         });

//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//       toast.error(error.response.data.message);
//     }
//   };

//   return (
//     <Layout>
//       {loading && <StyledDotLoader />}
//       <div className={styled.header}>Update product</div>
//       <Formik
//         initialValues={product}
//         enableReinitializeinitialValues={{
//           name: product.name,
//           brand: product.brand,
//           label: product.label,
//           description: product.description,
//           category: product.category,
//           subCategories: product.subCategories,
//           subProducts: product.subProducts,
//           parent: product.parent,
//           sku: product.sku,
//           discount: product.discount,
//           color: product.color,
//           imageInputFile: '',
//           styleInput: '',
//           sizes: product.sizes,
//           details: product.details,
//           questions: product.questions,
//         }}
//         onSubmit={updateProductHandler}
//       >
//         {(formik) => (
//           <Form>
//             <div className={styled.form__row_section}>
//               <div className={styled.subHeader}>
//                 <span>Step 1 :</span> &nbsp;Add to an existing product
//                 (required)
//               </div>
//               <div className={styled.form__row_flex}>
//                 <SingularSelect
//                   name='parent'
//                   value={product.parent}
//                   placeholder='Parent product'
//                   data={parents}
//                   header='Add to an existing product'
//                   handleChange={selectHandleChange}
//                 />

//                 <SingularSelect
//                   name='category'
//                   value={product.category}
//                   placeholder='Category'
//                   data={categories}
//                   header='Select a category'
//                   handleChange={selectHandleChange}
//                   disabled={product.parent}
//                 />
//               </div>

//               <MultipleSelect
//                 name='subCategories'
//                 value={product.subCategories}
//                 data={subs}
//                 header='Sub-Categories'
//                 handleChange={(e) => {
//                   setProduct({ ...product, subCategories: e.target.value });
//                 }}
//                 disabled={product.parent}
//               />
//             </div>

//             <div className={styled.form__row_section}>
//               <div className={styled.subHeader}>
//                 <span>Step 2 :</span> &nbsp;Upload images (required)
//               </div>
//               <Images
//                 name='imageInputFile'
//                 header=''
//                 text='Add images'
//                 images={product.images}
//                 setImages={setNewImages}
//                 setColorImage={setColorImage}
//               />
//             </div>

//             <div className={styled.form__row_section}>
//               <div className={styled.subHeader}>
//                 <span>Step 3 :</span> &nbsp;Pick product color (required)
//               </div>

//               <Colors
//                 name='color'
//                 product={product}
//                 setProduct={setProduct}
//                 colorImage={colorImage}
//                 setColorImage={setColorImage}
//                 images={images}
//               />
//               <div className={styled.form__row_flex}>
//                 {product?.color && (
//                   <div className={styled.color_span}>
//                     <span>
//                       Color&nbsp;
//                       <b style={{ fontWeight: 600 }}>
//                         {product?.subProducts?.map((s) => s.color.color)}
//                       </b>
//                       &nbsp;has been chosen
//                     </span>
//                     <span
//                       style={{
//                         background: product.subProducts.map(
//                           (s) => s.color.color
//                         ),
//                       }}
//                     ></span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className={styled.form__row_section}>
//               <Styles
//                 product={product}
//                 setProduct={setProduct}
//                 colorImage={colorImage}
//               />
//               {product?.color?.image && (
//                 <img
//                   src={product?.color?.image}
//                   className={styled.image_span}
//                   alt=''
//                 />
//               )}
//             </div>

//             <div className={styled.form__row_section}>
//               <div className={styled.subHeader}>
//                 <span>Step 4 :</span> &nbsp;Basic infos (required)
//               </div>
//               <AdminInput
//                 type='text'
//                 label='Name'
//                 name='name'
//                 placeholder=''
//                 onChange={handleChange}
//                 value={product.name}
//                 className='fixSpan'
//               />
//               <div className={styled.form__row_flex}>
//                 <AdminInput
//                   type='text'
//                   label='SKU'
//                   name='sku'
//                   placeholder=''
//                   onChange={handleChange}
//                   value={product.sku}
//                   className='fixSpan'
//                 />
//                 <AdminInput
//                   type='text'
//                   label='Discount'
//                   name='discount'
//                   placeholder=''
//                   onChange={handleChange}
//                   value={product.discount}
//                   className='fixSpan'
//                 />
//               </div>
//               <AdminInput
//                 type='text'
//                 label='Brand'
//                 name='brand'
//                 placeholder=''
//                 onChange={handleChange}
//                 value={product.brand}
//                 className='fixSpan'
//               />
//               <AdminInput
//                 type='text'
//                 label='Label'
//                 name='label'
//                 placeholder=''
//                 onChange={handleChange}
//                 value={product.label}
//                 className='fixSpan'
//               />
//               <AdminInput
//                 type='textarea'
//                 label='Description'
//                 name='description'
//                 placeholder=''
//                 onChange={handleChange}
//                 value={product.description}
//                 className='fixSpan'
//               />
//             </div>

//             <div className={styled.form__row_section}>
//               <div className={styled.subHeader}>
//                 <span>Step 5 :</span> &nbsp;Select product sizes
//               </div>
//               <Sizes
//                 name='sizes'
//                 sizes={product.sizes}
//                 product={product}
//                 setProduct={setProduct}
//                 selectHandleChange={selectHandleChange}
//               />
//             </div>

//             <div className={styled.form__row_section}>
//               <div className={styled.subHeader}>
//                 <span>Step 6 :</span> &nbsp;Additional details (optional)
//               </div>
//               <Details
//                 name='details'
//                 details={product.details}
//                 setProduct={setProduct}
//                 product={product}
//                 selectHandleChange={selectHandleChange}
//               />
//             </div>

//             <div className={styled.form__row_section}>
//               <div className={styled.subHeader}>
//                 <span>Step 7 :</span> &nbsp;Common questions (optional)
//               </div>
//               <Questions
//                 value={product.questions}
//                 name='questions'
//                 questions={product.questions}
//                 setProduct={setProduct}
//                 product={product}
//                 selectHandleChange={selectHandleChange}
//               />
//             </div>

//             <div className={`${styled.btn} ${styled.submit_btn}`}>
//               <Button
//                 variant='contained'
//                 type='submit'
//                 startIcon={<MdAssignmentAdd />}
//                 color='info'
//               >
//                 Update product
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </Layout>
//   );
// }

// export async function getServerSideProps() {
//   await db.connectDb();

//   const parents = await Product.find().lean();
//   const categories = await Category.find().lean();

//   await db.disConnectDb();

//   return {
//     props: {
//       parents: JSON.parse(JSON.stringify(parents)),
//       categories: JSON.parse(JSON.stringify(categories)),
//     },
//   };
// }

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { MdAssignmentAdd } from 'react-icons/md';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import styled from '@/styles/CreateProduct.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/Admin/Layout';
import SingularSelect from '@/components/Select/SingularSelect';
import MultipleSelect from '@/components/Select/MultipleSelect';
import AdminInput from '@/components/Input/AdminInput';
import Images from '@/components/Admin/CreateProduct/Images';
import Colors from '@/components/Admin/CreateProduct/Colors';
import Styles from '@/components/Admin/CreateProduct/Styles';
import Sizes from '@/components/Admin/CreateProduct/Sizes';
import Details from '@/components/Admin/CreateProduct/Details';
import Questions from '@/components/Admin/CreateProduct/Questions';
import Swal from 'sweetalert2';
import dataURItoBlob from '@/utils/dataURItoBlob';
import { uploadHandler } from '@/utils/request';
import StyledDotLoader from '@/components/Loaders/DotLoader';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import db from '@/utils/db';

const API_BASE_URL = 'https://www.telejkam.uz/api';

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
};

const validationSchema = Yup.object({
  name: Yup.string().required('Название продукта обязательно'),
  description: Yup.string().required('Описание продукта обязательно'),
  brand: Yup.string().required('Бренд обязателен'),
  category: Yup.string().required('Категория обязательна'),
  sku: Yup.string().required('SKU обязателен'),
});

export default function UpdateProductPage({ categories }) {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(initialState);
  const [colorImage, setColorImage] = useState('');
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState([]);

  const token = Cookies.get('__Secure-next-auth.session-token');

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product.category) {
      fetchSubcategories();
    }
  }, [product.category]);

  const fetchProduct = async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/product/${id}`);
      setProduct({
        ...data,
        category: data.category,
        subCategories: data.subCategories,
        images: data.subProducts.map((s) => s.images.map((i) => i.url)).flat(),
        description_images: data.subProducts
          .map((s) => s?.description_images?.map((i) => i?.url))
          .flat(),
        color: data.subProducts[0].color,
        sizes: data.subProducts[0].sizes,
        discount: data.subProducts[0].discount,
        sku: data.subProducts[0].sku,
      });
      setImages(data.subProducts.map((s) => s.images.map((i) => i.url)).flat());
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Ошибка при загрузке продукта');
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/subcategory?category=${product.category}`
      );
      setSubs(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (images.length < 1 && newImages.length < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Не найдено изображений!',
        text: 'Пожалуйста, загрузите хотя бы 1 изображение продукта.',
      });
      setSubmitting(false);
      return;
    }

    setLoading(true);
    let uploaded_images = [...images];

    if (newImages.length > 0) {
      try {
        const formData = new FormData();
        newImages.forEach((image) =>
          formData.append('file', dataURItoBlob(image))
        );
        formData.append('path', 'product images');
        const newUploadedImages = await uploadHandler(formData);
        uploaded_images = [
          ...uploaded_images,
          ...newUploadedImages.map((img) => img.url),
        ];
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Ошибка при загрузке изображений');
        setLoading(false);
        setSubmitting(false);
        return;
      }
    }

    let style_image = values.color.image;
    if (
      typeof values.color.image === 'string' &&
      values.color.image.startsWith('data:')
    ) {
      try {
        const formData = new FormData();
        formData.append('file', dataURItoBlob(values.color.image));
        formData.append('path', 'product style images');
        const uploadedStyleImage = await uploadHandler(formData);
        style_image = uploadedStyleImage[0].url;
      } catch (error) {
        console.error('Error uploading style image:', error);
        toast.error('Ошибка при загрузке изображения стиля');
        setLoading(false);
        setSubmitting(false);
        return;
      }
    }

    const updatedProduct = {
      ...values,
      images: uploaded_images,
      color: { ...values.color, image: style_image },
    };

    try {
      const { data } = await axiosInstance.put(
        `/admin/product/${id}`,
        updatedProduct
      );
      toast.success(data.message);
      router.push('/admin/dashboard/product/all');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(
        error.response?.data?.message || 'Ошибка при обновлении продукта'
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {loading && <StyledDotLoader />}
      <div className={styled.header}>Обновить продукт</div>
      <Formik
        enableReinitialize
        initialValues={product}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className={styled.form__row_section}>
              {/* <div className={styled.subHeader}>
                <span>Шаг 1:</span> &nbsp;Выберите категорию и подкатегорию
              </div> */}
              <SingularSelect
                name='category'
                value={formik.values.category}
                placeholder='Категория'
                data={categories}
                header='Выберите категорию'
                handleChange={(name, value) =>
                  formik.setFieldValue(name, value)
                }
              />
              <MultipleSelect
                name='subCategories'
                value={formik.values.subCategories}
                data={subs}
                header='Подкатегории'
                handleChange={(e) =>
                  formik.setFieldValue('subCategories', e.target.value)
                }
              />
            </div>

            <div className={styled.form__row_section}>
              {/* <div className={styled.subHeader}>
                <span>Шаг 2:</span> &nbsp;Загрузите изображения
              </div> */}
              <Images
                name='imageInputFile'
                header=''
                text='Добавить изображения'
                images={images}
                setImages={setImages}
                newImages={newImages}
                setNewImages={setNewImages}
                setColorImage={setColorImage}
              />
            </div>

            <div className={styled.form__row_section}>
              {/* <div className={styled.subHeader}>
                <span>Шаг 3:</span> &nbsp;Выберите цвет продукта
              </div> */}
              <Colors
                name='color'
                product={formik.values}
                setProduct={(newValues) =>
                  formik.setValues({ ...formik.values, ...newValues })
                }
                colorImage={colorImage}
                setColorImage={setColorImage}
                images={images}
              />
            </div>

            <div className={styled.form__row_section}>
              <Styles
                product={formik.values}
                setProduct={(newValues) =>
                  formik.setValues({ ...formik.values, ...newValues })
                }
                colorImage={colorImage}
              />
            </div>

            <div className={styled.form__row_section}>
              {/* <div className={styled.subHeader}>
                <span>Шаг 4:</span> &nbsp;Основная информация
              </div> */}
              <AdminInput
                type='text'
                label='Название'
                name='name'
                placeholder='Название продукта'
              />
              <AdminInput
                type='text'
                label='SKU'
                name='sku'
                placeholder='SKU продукта'
              />
              <AdminInput
                type='text'
                label='Бренд'
                name='brand'
                placeholder='Бренд'
              />
              <AdminInput
                type='text'
                label='Метка'
                name='label'
                placeholder='Метка продукта'
              />
              <AdminInput
                type='number'
                label='Скидка'
                name='discount'
                placeholder='Скидка в процентах'
              />
              <AdminInput
                as='textarea'
                label='Описание'
                name='description'
                placeholder='Описание продукта'
              />
            </div>

            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 5:</span> &nbsp;Размеры и цены ПОЖАЛУЙСТА НАЖМИТЕ НЕТ
                РАЗМЕРА ЕСЛИ НЕТ РАЗМЕРА У ПРОДУКТА
              </div>
              <Sizes
                sizes={formik.values.sizes}
                product={formik.values}
                setProduct={(newValues) =>
                  formik.setValues({ ...formik.values, ...newValues })
                }
              />
            </div>

            {/* <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 6:</span> &nbsp;Дополнительные детали
              </div>
              <Details
                details={formik.values.details}
                setProduct={(newValues) =>
                  formik.setValues({ ...formik.values, ...newValues })
                }
              />
            </div>

            <div className={styled.form__row_section}>
              <div className={styled.subHeader}>
                <span>Шаг 7:</span> &nbsp;Часто задаваемые вопросы
              </div>
              <Questions
                questions={formik.values.questions}
                setProduct={(newValues) =>
                  formik.setValues({ ...formik.values, ...newValues })
                }
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
                Обновить продукт
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connectDb();
  const categories = await Category.find().lean();
  await db.disConnectDb();
  return {
    props: {
      categories,
    },
  };
}
