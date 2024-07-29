import { Category } from '@/models/Category';
import { SubCategory } from '@/models/SubCategory';
import db from '@/utils/db';
import slugify from 'slugify';
import auth from '../../../middleware/auth';
import admin from '../../../middleware/admin';
import { createRouter } from 'next-connect';

const router = createRouter().use(auth).use(admin);

router.get(async (req, res) => {
  try {
    await db.connectDb();

    const { category } = req.query;

    if (!category) {
      return res.json([]);
    }

    const results = await SubCategory.find({ parent: category }).select('name');

    await db.disConnectDb();

    return res.json(results);
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

router.post(async (req, res) => {
  try {
    await db.connectDb();
    const { name, parent } = req.body;

    const test = await SubCategory.findOne({ name });

    if (test) {
      await db.disConnectDb();
      return res.status(400).json({
        message: 'Sub-Category already exists, try a different name.',
      });
    }

    await new SubCategory({ name, parent, slug: slugify(name) }).save();

    const subCategories = await SubCategory.find({})
      .populate({ path: 'parent', model: Category })
      .sort({ updatedAt: -1 });

    await db.disConnectDb();

    res.status(201).json({
      subCategories,
      message: `Sub-Category ${name} has been created successfully.`,
    });
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

router.delete(async (req, res) => {
  try {
    await db.connectDb();
    const { id } = req.query;

    await SubCategory.findByIdAndDelete(id);

    const subCategories = await SubCategory.find({})
      .populate({ path: 'parent', model: Category })
      .sort({ updatedAt: -1 });

    await db.disConnectDb();

    return res.json({
      message: 'Sub-Category has been deleted successfully.',
      subCategories,
    });
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

router.put(async (req, res) => {
  try {
    const { id, name, parent } = req.body;

    await db.connectDb();

    await SubCategory.findByIdAndUpdate(id, {
      name,
      parent,
      slug: slugify(name),
    });

    const subCategories = await SubCategory.find({})
      .populate({ path: 'parent', model: Category })
      .sort({ createdAt: -1 });

    await db.disConnectDb();

    return res.json({
      message: 'Sub-Category has been updated successfully.',
      subCategories,
    });
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
