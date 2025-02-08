import { Settings } from '@/models/Settings';
import db from '@/utils/db';
import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import { createRouter } from 'next-connect';

const router = createRouter().use(auth).use(admin);

// Get settings
router.get(async (req, res) => {
  try {
    await db.connectDb();
    const settings = (await Settings.findOne({})) || new Settings();
    await db.disConnectDb();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.post(async (req, res) => {
  try {
    await db.connectDb();
    const { heroImages, contacts } = req.body;

    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({
        heroImages,
        contacts,
      });
    } else {
      settings.heroImages = heroImages;
      settings.contacts = contacts;
    }

    await settings.save();
    await db.disConnectDb();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
