import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import db from '@/utils/db';
import { Product } from '@/models/Product';
import slugify from 'slugify';
import { createRouter } from 'next-connect';
const router = createRouter().use(auth).use(admin);

router.post(async (req, res) => {
  try {
    console.log(req.body);
    await db.connectDb();
    if (req.body.parent) {
      const parent = await Product.findById(req.body.parent);
      if (!parent) {
        return res.status(404).json({ message: 'Parent product not found.' });
      } else {
        const newParent = await parent.updateOne(
          {
            $push: {
              subProducts: {
                sku: req.body.sku,
                color: req.body.color,
                images: req.body.images,
                sizes: req.body.sizes,
                discount: req.body.discount,
              },
            },
          },
          { new: true }
        );
        // res.status(201).json({ message: "Product updated successfully." });
      }
    } else {
      req.body.slug = slugify(req.body.name, { lower: true });
      const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        brand: req.body.brand,
        label: req.body.label,
        details: req.body.details,
        questions: req.body.questions,
        slug: req.body.slug,
        category: req.body.category,
        subCategories: req.body.subCategories,
        subProducts: [
          {
            sku: req.body.sku,
            color: req.body.color,
            images: req.body.images,
            sizes: req.body.sizes,
            discount: req.body.discount,
          },
        ],
      });

      await newProduct.save();
      res.status(201).json({ message: 'Product created successfully.' });
    }

    await db.disConnectDb();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
