import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import db from '@/utils/db';
import { Product } from '@/models/Product';
import slugify from 'slugify';
import { createRouter } from 'next-connect';
const router = createRouter().use(auth).use(admin);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // Increase to 10MB or adjust as needed
    },
    responseLimit: false,
  },
};

router.post(async (req, res) => {
  try {
    await db.connectDb();
    const {
      parent,
      sku,
      // color,
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
              subProducts: { sku, images, sizes, discount },
            },
            // color
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
        subProducts: [{ sku, images, sizes, discount }],
      });
      // color

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
