// pages/api/admin/settings.js
import fs from 'fs/promises';
import path from 'path';
import { createRouter } from 'next-connect';
import auth from '@/middleware/auth';
import admin from '@/middleware/admin';

const router = createRouter().use(auth).use(admin);

const settingsPath = path.join(process.cwd(), 'config', 'settings.json');
// Get settings
router.get(async (req, res) => {
  try {
    console.log(settingsPath, 'settings path');

    const settings = await fs.readFile(settingsPath, 'utf8');
    res.json(JSON.parse(settings));
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

// Update settings
router.post(async (req, res) => {
  console.log(settingsPath, 'settings path');

  try {
    const newSettings = req.body;
    await fs.writeFile(settingsPath, JSON.stringify(newSettings, null, 2));
    res.json(newSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router.handler();
