import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TextField, Button, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as Icon from 'react-feather';
import styled from './styles.module.scss';

export default function Settings({ initialSettings }) {
  const [settings, setSettings] = useState(
    initialSettings || {
      heroImages: [],
      contacts: {
        phone: '',
        address: '',
        telegram: '',
        instagram: '',
        location: '',
      },
    }
  );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append('file', file);
        });
        formData.append('path', 'hero images');

        const { data } = await axios.post('/api/cloudinary', formData);

        setSettings((prev) => ({
          ...prev,
          heroImages: [
            ...prev.heroImages,
            ...data.map((img, index) => ({
              url: img.url,
              order: prev.heroImages.length + index,
            })),
          ],
        }));

        toast.success('Images uploaded successfully!');
      } catch (error) {
        toast.error('Error uploading images');
      }
    },
    [settings.heroImages]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    onDrop,
  });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [name]: value,
      },
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(settings.heroImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setSettings((prev) => ({
      ...prev,
      heroImages: reorderedItems,
    }));
  };

  const removeImage = async (index) => {
    const newImages = settings.heroImages.filter((_, i) => i !== index);
    setSettings((prev) => ({
      ...prev,
      heroImages: newImages,
    }));
  };

  const saveSettings = async () => {
    try {
      await axios.post('/api/admin/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Error saving settings');
    }
  };

  return (
    <div className={styled.settings}>
      <h2>Hero Section Images</h2>
      <div {...getRootProps()} className={styled.dropzone}>
        <input {...getInputProps()} />
        <div className={styled.dropzone__content}>
          <Icon.Upload />
          <p>Drag & drop images here, or click to select</p>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='hero-images'>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styled.images_list}
            >
              {settings.heroImages.map((image, index) => (
                <Draggable
                  key={image.url}
                  draggableId={image.url}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styled.image_item}
                    >
                      <img src={image.url} alt='' />
                      <IconButton
                        onClick={() => removeImage(index)}
                        className={styled.remove_btn}
                      >
                        <Icon.Trash2 />
                      </IconButton>
                      <div className={styled.drag_handle}>
                        <Icon.Move />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <h2>Contact Information</h2>
      <div className={styled.contacts_form}>
        <TextField
          label='Phone Number'
          name='phone'
          value={settings.contacts.phone}
          onChange={handleContactChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Address'
          name='address'
          value={settings.contacts.address}
          onChange={handleContactChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Telegram'
          name='telegram'
          value={settings.contacts.telegram}
          onChange={handleContactChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Instagram'
          name='instagram'
          value={settings.contacts.instagram}
          onChange={handleContactChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Location URL'
          name='location'
          value={settings.contacts.location}
          onChange={handleContactChange}
          fullWidth
          margin='normal'
        />
      </div>

      <Button
        variant='contained'
        color='primary'
        onClick={saveSettings}
        className={styled.save_btn}
      >
        Save Settings
      </Button>
    </div>
  );
}
