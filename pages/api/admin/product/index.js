import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import db from '@/utils/db';
import { Product } from '@/models/Product';
import slugify from 'slugify';
import { createRouter } from 'next-connect';
const router = createRouter().use(auth).use(admin);

router.post(async (req, res) => {
  try {
    await db.connectDb();
    const {
      parent,
      sku,
      color,
      images,
      sizes,
      discount,
      name,
      description,
      brand,
      label,
      details,
      questions,
      category,
      subCategories,
    } = req.body;

    if (parent) {
      const parentProduct = await Product.findById(parent);
      if (!parentProduct) {
        return res.status(404).json({ message: 'Parent product not found.' });
      } else {
        await parentProduct.updateOne(
          {
            $push: {
              subProducts: { sku, color, images, sizes, discount },
            },
          },
          { new: true }
        );
        res.status(201).json({ message: 'Product updated successfully.' });
      }
    } else {
      const slug = slugify(name, { lower: true });
      const newProduct = new Product({
        name,
        description,
        brand,
        label,
        details,
        questions,
        slug,
        category,
        subCategories,
        subProducts: [{ sku, color, images, sizes, discount }],
      });

      await newProduct.save();
      res.status(201).json({ message: 'Product created successfully.' });
    }

    await db.disConnectDb();
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
