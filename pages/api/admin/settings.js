// pages/api/admin/settings.js
import fs from 'fs/promises';
import path from 'path';
import { createRouter } from 'next-connect';
import auth from '@/middleware/auth';
import admin from '@/middleware/admin';

const router = createRouter().use(auth).use(admin);

const settingsPath = path.join(process.cwd(), 'config', 'settings.json');

// Ensure settings file exists with default values
const ensureSettingsFile = async () => {
  try {
    await fs.access(settingsPath);
  } catch {
    const defaultSettings = {
      heroImages: [],
      flashDealsEndDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 7 days from now
    };
    await fs.writeFile(settingsPath, JSON.stringify(defaultSettings, null, 2));
  }
};

// Get settings
router.get(async (req, res) => {
  try {
    await ensureSettingsFile();
    const settings = await fs.readFile(settingsPath, 'utf8');
    res.json(JSON.parse(settings));
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({
      error: 'Failed to read settings',
      details: error.message,
    });
  }
});

// Update settings
router.post(async (req, res) => {
  try {
    await ensureSettingsFile();

    const newSettings = {
      heroImages: req.body.heroImages || [],
      flashDealsEndDate: req.body.flashDealsEndDate || new Date().toISOString(),
    };

    // Validate heroImages structure
    if (!Array.isArray(newSettings.heroImages)) {
      throw new Error('heroImages must be an array');
    }

    newSettings.heroImages.forEach((image, index) => {
      if (!image.url || !image.alt) {
        throw new Error(`Invalid image data at index ${index}`);
      }
    });

    // Validate flashDealsEndDate
    if (!Date.parse(newSettings.flashDealsEndDate)) {
      throw new Error('Invalid flashDealsEndDate');
    }

    await fs.writeFile(settingsPath, JSON.stringify(newSettings, null, 2));
    res.json(newSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      error: 'Failed to update settings',
      details: error.message,
    });
  }
});

export default router.handler();
