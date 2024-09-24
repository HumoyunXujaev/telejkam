import axios from 'axios';

export const saveCart = async (cart, user_id) => {
  try {
    const { data } = await axios.post('/api/user/saveCart', {
      cart,
      user_id,
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

// function to save address to local storage
export const saveAddress = (address) => {
  localStorage.setItem('addresses', JSON.stringify(address));
};

// export const saveAddress = async (address, user_id) => {
//   try {
//     const { data } = await axios.post("/api/user/saveAddress", {
//       address,
//       user_id,
//     });
//     return data;
//   } catch (error) {
//     return error.response.data.message;
//   }
// };

// function to update address in local storage
export const changeDefaultAddress = (address) => {
  const addresses = JSON.parse(localStorage.getItem('addresses'));
  const updatedAddresses = addresses.map((a) =>
    a._id === address._id ? address : a
  );
  localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
};

// export const changeDefaultAddress = async (user_id, address_id) => {
//   try {
//     const { data } = await axios.put('/api/user/manageAddress', {
//       user_id,
//       address_id,
//     });
//     return data;
//   } catch (error) {
//     return error.response.data.message;
//   }
// };

// function to delete address from local storage
export const removeAddress = (address) => {
  const addresses = JSON.parse(localStorage.removeItem('addresses'));
};

// export const deleteAddress = async (user_id, address_id) => {
//   try {
//     const { data } = await axios.post('/api/user/deleteAddress', {
//       user_id,
//       address_id,
//     });
//     return data;
//   } catch (error) {
//     return error.response.data.message;
//   }
// };


export const uploadHandler = async (formData) => {
  const { data } = await axios.post('/api/cloudinary', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};
