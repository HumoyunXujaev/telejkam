import { Product } from '@/models/Product';
import db from '@/utils/db';

async function handler(req, res) {
  try {
    await db.connectDb();

    const id = req.query?.id;
    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.method === 'GET') {
      const style = req.query.style || 0;
      const size = req.query.size || 0;
      const subProduct = product.subProducts[style];
      const productSize = subProduct.sizes[size];

      const discount = subProduct.discount;
      const priceBefore = productSize?.price || 0;
      const priceAfter = priceBefore - (priceBefore * discount) / 100;
      const price = discount > 0 ? priceAfter : priceBefore;
      const price_description = productSize?.price_description;

      await db.disConnectDb();

      return res.status(200).json({
        _id: product._id,
        style: Number(style),
        name: product.name,
        description: product.description,
        slug: product.slug,
        sku: subProduct.sku,
        brand: product.brand,
        label: product.label,
        category: product.category,
        subCategories: product.subCategories,
        shipping: product.shipping,
        images: subProduct.images,
        color: subProduct.color,
        size: productSize?.size,
        price,
        price_description,
        priceBefore,
        quantity: productSize?.qty,
      });
    } else {
      await db.disConnectDb();
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
}

export default handler;
