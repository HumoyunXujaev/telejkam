import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import { Product } from '@/models/Product';
import db from '@/utils/db';

import { createRouter } from 'next-connect';
const router = createRouter().use(auth).use(admin);

router.post(async (req, res) => {
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
