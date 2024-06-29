/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { MdCancel, MdDelete, MdEdit, MdSave } from 'react-icons/md';
import { IoFilter } from 'react-icons/io5';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';

import styled from './styles.module.scss';
import Router from 'next/router';

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'image',
    numeric: false,
    disablePadding: true,
    label: 'Пользователь',
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Имя',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Почта',
  },
  {
    id: 'verified',
    numeric: true,
    disablePadding: false,
    label: 'Проверен',
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Роль',
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Действия',
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'выбрать всех',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{
            flex: '1 1 100%',
            color: '#666',
            fontFamily: 'Poppins',
            fontSize: 14,
            fontWeight: 500,
          }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} выбрано
        </Typography>
      ) : (
        <Typography
          sx={{
            flex: '1 1 100%',
            color: '#666',
            fontFamily: 'Poppins',
            fontSize: 14,
            fontWeight: 500,
          }}
          id='tableTitle'
          component='div'
        >
          Не выбрано ни одного пользователя
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title='Delete'>
            <IconButton>
              <MdDelete />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <IoFilter />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ rows }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedRow, setEditedRow] = React.useState({});

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  const handleEditClick = (row) => {
    setIsEditing(true);
    setEditedRow({ ...row });
  };

  const handleSaveClick = async () => {
    try {
      await axios
        .put(`/api/admin/user/`, {
          _id: editedRow._id,
          emailVerified: editedRow.emailVerified,
          role: editedRow.role,
        })
        .then((res) => {
          console.log('Updated user:', res.data);
        })
        .finally(() => {
          Router.reload();
        });
      setIsEditing(false);
      // Optionally, refresh the data from the server here
    } catch (error) {
      console.error('Error saving user data', error);
    }
  };

  const handleDeleteClick = async (id) => {
    const data = await axios.delete(`/api/admin/user?id=${id}`);
    console.log('Deleted user:', data);
    console.log('Deleted user:', id);
    Router.reload();

    // .finally(() => {
    //   Router.reload();
    // });

    // console.log('Deleting user:', row);

    // const data = await axios.delete(`/api/admin/user/`, {
    //   _id: row._id,
    // });

    // console.log('Deleted user:', data);

    // .finally(() => {
    //   Router.reload();
    // });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedRow({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRow((prevRow) => ({ ...prevRow, [name]: value }));
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
            className={styled.table}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        color='primary'
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component='th'
                      id={labelId}
                      scope='row'
                      padding='none'
                      style={{ padding: '10px 0' }}
                    >
                      <img
                        src={row.image}
                        alt={row.name}
                        className={styled.table__img}
                      />
                    </TableCell>
                    <TableCell align='right'>{row.name}</TableCell>
                    <TableCell align='right'>{row.email}</TableCell>

                    <TableCell align='left'>
                      {isEditing && editedRow._id === row._id ? (
                        <select
                          name='emailVerified'
                          value={editedRow.emailVerified}
                          onChange={handleChange}
                        >
                          <option value='true'>True</option>
                          <option value='false'>False</option>
                        </select>
                      ) : row.emailVerified ? (
                        <div className={styled.table__ver}>
                          <img src='/images/verified.png' alt='' />
                          Проверен
                        </div>
                      ) : (
                        <div className={styled.table__unver}>
                          <img
                            src='/images/unverified.png'
                            alt=''
                            className={styled.table__ver}
                          />
                          Не проверен
                        </div>
                      )}
                    </TableCell>
                    <TableCell align='left'>
                      {isEditing && editedRow._id === row._id ? (
                        <select
                          name='role'
                          value={editedRow.role}
                          onChange={handleChange}
                        >
                          <option value='admin'>Админ</option>
                          <option value='user'>Пользователь</option>
                        </select>
                      ) : (
                        row.role
                      )}
                    </TableCell>
                    <TableCell align='left'>
                      {isEditing && editedRow._id === row._id ? (
                        <>
                          <IconButton onClick={handleSaveClick}>
                            <MdSave />
                          </IconButton>
                          <IconButton onClick={handleCancelClick}>
                            <MdCancel />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Tooltip title='Edit'>
                            <IconButton onClick={() => handleEditClick(row)}>
                              <MdEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton
                              onClick={() => handleDeleteClick(row._id)}
                            >
                              <MdDelete />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Сжатый вид'
      />
    </Box>
  );
}
