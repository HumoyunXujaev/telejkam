/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {
  FaCaretDown,
  FaCaretUp,
  FaSave,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';
import styled from './styles.module.scss';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { ca } from 'date-fns/locale';
import { toast } from 'react-toastify';
import Router from 'next/router';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const [updatedOrder, setUpdatedOrder] = useState({
    _id: row._id,
    status: row.status,
    isPaid: row.isPaid,
    paymentMethod: row.paymentMethod,
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // useeffect to automatically change the page if something changes or deletes
  React.useEffect(() => {}, [row, updatedOrder]);

  // send id trough the parameter of url

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`/api/admin/order?_id=${row._id}`);
      Router.reload();
      // toast.success('Order deleted');
      console.log('deleted', row._id);
    } catch (error) {
      console.log(error, row._id);
    }
  };

  console.log(updatedOrder);
  const handleSaveClick = async () => {
    try {
      const { data } = await axios.put('/api/admin/order', {
        ...updatedOrder,
      });

      console.log('tgdata', tgdata);
      console.log('updated order', data);
      setIsEditing(false);
      Router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrder((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <FaCaretUp /> : <FaCaretDown />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {row._id}
        </TableCell>
        <TableCell align='left'>
          {isEditing ? (
            <Select
              name='paymentMethod'
              value={updatedOrder.paymentMethod}
              onChange={handleChange}
              displayEmpty
            >
              {/* <MenuItem value='Credit Card'>Credit Card</MenuItem> */}
              <MenuItem value='uzum_nasiya'>Uzum Nasiya</MenuItem>
              <MenuItem value='COD'>Cash on delivery</MenuItem>
            </Select>
          ) : (
            row.paymentMethod
          )}
        </TableCell>
        <TableCell align='left'>
          {isEditing ? (
            <Select
              name='isPaid'
              value={updatedOrder.isPaid}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value={true}>Оплачено</MenuItem>
              <MenuItem value={false}>Не Оплачено</MenuItem>
            </Select>
          ) : row.isPaid ? (
            <div className={styled.table__ver}>
              <img src='/images/verified.png' alt='' /> Оплачено
            </div>
          ) : (
            <div className={styled.table__unver}>
              <img src='/images/unverified.png' alt='' /> Не оплачено
            </div>
          )}
        </TableCell>
        <TableCell align='left'>
          {isEditing ? (
            <Select
              name='status'
              value={updatedOrder.status}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value='Not processed'>Not Processed</MenuItem>
              <MenuItem value='Processing'>Processing</MenuItem>
              <MenuItem value='Dispatched'>Dispatched</MenuItem>
              <MenuItem value='Cancelled'>Cancelled</MenuItem>
              <MenuItem value='Completed'>Completed</MenuItem>
            </Select>
          ) : (
            row.status
          )}
        </TableCell>
        <TableCell align='left'>`{row.total} сум`</TableCell>
        <TableCell align='left'>
          {isEditing ? (
            <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={handleSaveClick}
            >
              <FaSave />
            </Button>
          ) : (
            <>
              <IconButton
                aria-label='edit'
                size='small'
                onClick={handleEditClick}
              >
                <FaEdit />
              </IconButton>
              <IconButton
                aria-label='delete'
                size='small'
                onClick={handleDeleteClick}
              >
                <FaTrash />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>

      <TableRow className='smallTable'>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  color: '#666',
                  fontWeight: 600,
                  marginTop: '1rem',
                  fontFamily: 'Poppins',
                }}
                gutterBottom
                component='div'
              >
                Order for
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    {/* <TableCell>Image</TableCell>
                    <TableCell>Full name</TableCell>
                    <TableCell>Email</TableCell> */}
                    <TableCell align='left'>Информация об адрессе</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row._id}>
                    {/* <TableCell component='th' scope='row'>
                      <img
                        src={row.user.image}
                        className={styled.table__img}
                        alt=''
                      />
                    </TableCell>
                    <TableCell>{row.user.name}</TableCell>
                    <TableCell align='left'>{row.user.email}</TableCell> */}
                    <TableCell align='left' className={styled.table__infos}>
                      <p>
                        <span>Имя:</span>&nbsp;
                        {row.shippingAddress.firstName}&nbsp;
                        {row.shippingAddress.lastName}
                      </p>
                      <p>
                        <span>Адресс:</span>&nbsp;
                        {row.shippingAddress.address1}
                      </p>
                      <p>
                        <span>Район_Город:</span>&nbsp;
                        {row.shippingAddress.state}, {row.shippingAddress.city}
                      </p>
                      <p>
                        <span>Страна:</span>&nbsp;{row.shippingAddress.country}
                      </p>
                      <p>
                        <span>Почтовый Индекс:</span>&nbsp;
                        {row.shippingAddress?.zipCode}
                      </p>
                      <p>
                        <span>Телефон:</span>&nbsp;
                        {row.shippingAddress.phoneNumber}
                      </p>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <TableRow className='smallTable'>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  color: '#666',
                  fontWeight: 600,
                  marginTop: '1rem',
                  fontFamily: 'Poppins',
                }}
                gutterBottom
                component='div'
              >
                Order items
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Картина</TableCell>
                    <TableCell>Имя Продукта</TableCell>
                    <TableCell>Размер</TableCell>
                    <TableCell>Количество</TableCell>
                    <TableCell>Цена</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell component='th' scope='row'>
                        {p.image ? (
                          <img
                            src={p.image}
                            alt=''
                            className={styled.table__productImg}
                          />
                        ) : (
                          'No image'
                        )}
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.size}</TableCell>
                      <TableCell>x {p.qty}</TableCell>
                      <TableCell>${p.price}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      <b style={{ fontSize: 14 }}>СУММА</b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell style={{ padding: '20px 0' }}>
                      <b style={{ fontSize: 14 }}>{row.total} сум</b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    isPaid: PropTypes.bool.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }).isRequired,
    shippingAddress: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      address1: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
    }).isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired,
        qty: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default function CollapsibleTable({ rows }) {
  console.log(rows);
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table' className={styled.table}>
        <TableHead>
          <TableRow>
            {/* <TableCell /> */}
            <TableCell>Детали</TableCell>
            <TableCell>Заказ</TableCell>
            <TableCell align='left'>Метод Оплаты</TableCell>
            <TableCell align='left'>Оплата</TableCell>
            <TableCell align='left'>Статус</TableCell>
            <TableCell align='left'>Купон</TableCell>
            <TableCell align='left'>Сумма</TableCell>
            <TableCell align='left'>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
CollapsibleTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      paymentMethod: PropTypes.string.isRequired,
      isPaid: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      }).isRequired,
      products: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          image: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          size: PropTypes.string.isRequired,
          qty: PropTypes.number.isRequired,
          price: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  onSave: PropTypes.func.isRequired,
};
