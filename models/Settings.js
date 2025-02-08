import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    heroImages: [
      {
        url: String,
        order: Number,
      },
    ],
    contacts: {
      phone: String,
      address: String,
      telegram: String,
      instagram: String,
      location: String,
    },
  },
  { timestamps: true }
);

export const Settings =
  mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
