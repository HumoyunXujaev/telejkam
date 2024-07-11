import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import { Product } from '@/models/Product';
import db from '@/utils/db';

import { createRouter } from 'next-connect';
const router = createRouter().use(auth).use(admin);

router.get(async (req, res) => {
  try {
    await db.connectDb();
    const productId = req.query?.id;

    const product = await Product.findById(productId).lean();

    if (!product) {
      await db.disConnectDb();
      return res.status(404).json({ message: 'Product not found!' });
    }

    await db.disConnectDb();

    res.status(200).json(product);
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

router.put(async (req, res) => {
  try {
    await db.connectDb();
    const productId = req.query.id;
    const {
      name,
      description,
      brand,
      category,
      subCategories,
      images,
      color,
      sizes,
      details,
      questions,
      label,
      sku,
      discount,
    } = req.body;

    const updatedProduct = await Product.findById(productId);

    if (!updatedProduct) {
      await db.disConnectDb();
      return res.status(404).json({ message: 'Product not found!' });
    }

    updatedProduct.name = name;
    updatedProduct.description = description;
    updatedProduct.brand = brand;
    updatedProduct.label = label;
    updatedProduct.category = category;
    updatedProduct.subCategories = subCategories;
    updatedProduct.details = details;
    updatedProduct.questions = questions;

    const updatedSubProducts = updatedProduct.subProducts.map((subProduct) => {
      subProduct.sku = sku;
      subProduct.color = color;
      subProduct.images = [...subProduct.images, ...images]; // Add new images to existing ones
      subProduct.sizes = sizes;
      subProduct.discount = discount;

      return subProduct;
    });

    updatedProduct.subProducts = updatedSubProducts;

    await updatedProduct.save();

    await db.disConnectDb();

    res.status(200).json({
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error) {
    await db.disConnectDb();
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.delete(async (req, res) => {
  try {
    await db.connectDb();
    const productId = req.query.id;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      await db.disConnectDb();
      return res.status(404).json({ message: 'Product not found!' });
    }

    await db.disConnectDb();

    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
