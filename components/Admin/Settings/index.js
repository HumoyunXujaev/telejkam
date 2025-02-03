import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios';

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    heroImages: [],
    flashDealsEndDate: dayjs(),
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/admin/settings');
      setSettings({
        ...response.data,
        flashDealsEndDate: dayjs(response.data.flashDealsEndDate),
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('file', file));
      formData.append('path', 'hero_images');

      const { data } = await axios.post('/api/cloudinary', formData);

      const newImages = data.map((img) => ({
        url: img.url,
        alt: `Hero Image ${settings.heroImages.length + 1}`,
      }));

      const updatedSettings = {
        ...settings,
        heroImages: [...settings.heroImages, ...newImages],
      };

      await axios.post('/api/admin/settings', updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDateChange = async (newDate) => {
    try {
      const updatedSettings = {
        ...settings,
        flashDealsEndDate: newDate.toISOString(),
      };

      await axios.post('/api/admin/settings', updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating flash deals date:', error);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      const updatedImages = settings.heroImages.filter((_, i) => i !== index);
      const updatedSettings = {
        ...settings,
        heroImages: updatedImages,
      };

      await axios.post('/api/admin/settings', updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <Paper className='p-6'>
      <Typography variant='h5' className='mb-6'>
        Site Settings
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant='h6' className='mb-4'>
            Hero Section Images
          </Typography>
          <input
            type='file'
            multiple
            accept='image/*'
            onChange={handleImageUpload}
            className='mb-4'
            disabled={uploading}
          />

          <div className='grid grid-cols-2 gap-4'>
            {settings.heroImages.map((image, index) => (
              <div key={index} className='relative'>
                <img
                  src={image.url}
                  alt={image.alt}
                  className='w-full h-40 object-cover rounded'
                />
                <Button
                  variant='contained'
                  color='error'
                  size='small'
                  onClick={() => handleRemoveImage(index)}
                  className='absolute top-2 right-2'
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant='h6' className='mb-4'>
            Flash Deals End Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={settings.flashDealsEndDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SettingsManager;
