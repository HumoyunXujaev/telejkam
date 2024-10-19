import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import { Product } from '@/models/Product';
import db from '@/utils/db';

import { createRouter } from 'next-connect';
const router = createRouter().use(auth).use(admin);

router.get(async (req, res) => {
  try {
    await db.connectDb();
    const productId = req.query.id;
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
      subProducts,
      details,
      questions,
      label,
    } = req.body;

    const updatedProduct = await Product.findById(productId);
    if (!updatedProduct) {
      await db.disConnectDb();
      return res.status(404).json({ message: 'Product not found!' });
    }

    // Обновляем основные поля продукта
    if (name) updatedProduct.name = name;
    if (description) updatedProduct.description = description;
    if (brand) updatedProduct.brand = brand;
    if (label) updatedProduct.label = label;
    if (category) updatedProduct.category = category;
    if (subCategories) updatedProduct.subCategories = subCategories;
    if (details) updatedProduct.details = details;
    if (questions) updatedProduct.questions = questions;

    // Обновляем subProducts, если они предоставлены
    if (subProducts && subProducts.length > 0) {
      updatedProduct.subProducts = subProducts.map((subProduct, index) => {
        const existingSubProduct = updatedProduct.subProducts[index] || {};
        return {
          ...existingSubProduct,
          sku: subProduct.sku || existingSubProduct.sku,
          color: subProduct.color || existingSubProduct.color,
          images: subProduct.images || existingSubProduct.images,
          sizes: subProduct.sizes || existingSubProduct.sizes,
          discount:
            subProduct.discount !== undefined
              ? subProduct.discount
              : existingSubProduct.discount,
        };
      });
    }

    await updatedProduct.save();
    await db.disConnectDb();

    res.status(200).json({
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
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
