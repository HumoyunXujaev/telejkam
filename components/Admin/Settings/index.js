import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as Icon from 'react-feather';

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    heroImages: [],
    flashDealsEndDate: dayjs(),
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [originalSettings, setOriginalSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/admin/settings');
      const settingsData = {
        ...response.data,
        flashDealsEndDate: dayjs(response.data.flashDealsEndDate),
      };
      setSettings(settingsData);
      setOriginalSettings(settingsData);
    } catch (error) {
      toast.error('Ошибка при загрузке настроек');
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post('/api/admin/settings', {
        ...settings,
        flashDealsEndDate: settings.flashDealsEndDate.toISOString(),
      });
      setOriginalSettings(settings);
      setHasChanges(false);
      toast.success('Настройки успешно сохранены');
    } catch (error) {
      toast.error('Ошибка при сохранении настроек');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
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

      setSettings(updatedSettings);
      setHasChanges(true);
      toast.success('Изображения успешно загружены');
    } catch (error) {
      toast.error('Ошибка при загрузке изображений');
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setSettings((prev) => ({
      ...prev,
      flashDealsEndDate: newDate,
    }));
    setHasChanges(true);
  };

  const handleEditImage = (image, index) => {
    setEditingImage({ ...image });
    setEditingIndex(index);
    setOpenEditDialog(true);
  };

  const handleUpdateImage = () => {
    const updatedImages = [...settings.heroImages];
    updatedImages[editingIndex] = editingImage;
    setSettings((prev) => ({
      ...prev,
      heroImages: updatedImages,
    }));
    setHasChanges(true);
    setOpenEditDialog(false);
    toast.success('Изображение обновлено');
  };

  const handleRemoveImage = (index) => {
    const updatedImages = settings.heroImages.filter((_, i) => i !== index);
    setSettings((prev) => ({
      ...prev,
      heroImages: updatedImages,
    }));
    setHasChanges(true);
    toast.info('Изображение удалено');
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setHasChanges(false);
    toast.info('Изменения отменены');
  };

  const handleReorder = (index, direction) => {
    const newImages = [...settings.heroImages];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [
        newImages[newIndex],
        newImages[index],
      ];
      setSettings((prev) => ({
        ...prev,
        heroImages: newImages,
      }));
      setHasChanges(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant='h5'>Настройки сайта</Typography>
          <Box>
            {hasChanges && (
              <>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={handleCancel}
                  sx={{ mr: 2 }}
                  startIcon={<Icon.X />}
                >
                  Отменить
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSave}
                  disabled={saving}
                  startIcon={<Icon.Save />}
                >
                  {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Hero Images Section */}
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Изображения для слайдера
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Button
                variant='contained'
                component='label'
                disabled={uploading}
                startIcon={<Icon.Upload />}
              >
                {uploading ? 'Загрузка...' : 'Загрузить изображения'}
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageUpload}
                  hidden
                />
              </Button>
            </Box>

            <Grid container spacing={2}>
              {settings.heroImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia
                      component='img'
                      height='200'
                      image={image.url}
                      alt={image.alt}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='body2' color='text.secondary'>
                          {`Слайд ${index + 1}`}
                        </Typography>
                        <Box>
                          {index > 0 && (
                            <IconButton
                              onClick={() => handleReorder(index, 'up')}
                              size='small'
                            >
                              <Icon.ArrowUp />
                            </IconButton>
                          )}
                          {index < settings.heroImages.length - 1 && (
                            <IconButton
                              onClick={() => handleReorder(index, 'down')}
                              size='small'
                            >
                              <Icon.ArrowDown />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => handleEditImage(image, index)}
                            size='small'
                          >
                            <Icon.Edit2 />
                          </IconButton>
                          <IconButton
                            onClick={() => handleRemoveImage(index)}
                            size='small'
                            color='error'
                          >
                            <Icon.Trash2 />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Flash Deals Section */}
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Настройки Flash Deals
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label='Дата окончания Flash Deals'
                value={settings.flashDealsEndDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDateTime={dayjs()}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Image Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Редактировать изображение</DialogTitle>
        <DialogContent>
          {editingImage && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label='Alt текст'
                value={editingImage.alt}
                onChange={(e) =>
                  setEditingImage({ ...editingImage, alt: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <img
                src={editingImage.url}
                alt={editingImage.alt}
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Отмена</Button>
          <Button onClick={handleUpdateImage} variant='contained'>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsManager;
