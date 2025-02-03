import React, { useEffect, useState } from 'react';
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Chip,
} from '@mui/material';

import { FcCheckmark } from 'react-icons/fc';
import * as Icon from 'react-feather';

export default function MultiSelect({ header, data, handleChange, disabled }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedOptions([]);
  }, [data]);

  const handleSelectionChange = (e) => {
    setSelectedOptions(e.target.value);
    handleChange(e);
    setOpen(false); // Закрываем Select после выбора
  };

  return (
    <FormControl sx={{ width: '100%', padding: 0 }}>
      <InputLabel>{header}</InputLabel>
      <Select
        multiple
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={selectedOptions}
        onChange={handleSelectionChange}
        disabled={disabled}
        input={<OutlinedInput label={header} />}
        renderValue={(selected) => (
          <Stack gap={1} direction='row' flexWrap='wrap'>
            {selected.map((value) => (
              <Chip
                key={value._id}
                label={value.name}
                onDelete={() =>
                  setSelectedOptions(
                    selectedOptions.filter((item) => item !== value)
                  )
                }
                deleteIcon={
                  <Icon.XCircle
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                }
              />
            ))}
          </Stack>
        )}
      >
        {data?.map((item) => (
          <MenuItem
            key={item?._id}
            value={item}
            sx={{ justifyContent: 'space-between' }}
          >
            {item.name}
            {selectedOptions?.includes(item) ? <FcCheckmark /> : null}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
