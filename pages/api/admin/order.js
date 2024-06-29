import db from '@/utils/db';
import { Order } from '@/models/Order';
import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import nextConnect from 'next-connect';

const handler = nextConnect().use(auth).use(admin);

handler.put(async (req, res) => {
  try {
    const { _id, status, isPaid, paymentMethod } = req.body;
    await db.connectDb();

    console.log('Request Body:', req.body);
    console.log('_id:', _id);

    const order = await Order.findByIdAndUpdate(
      _id,
      { status, isPaid, paymentMethod },
      { new: true } // Чтобы получить обновленный объект после обновления
    );

    await db.disConnectDb();

    if (!order) {
      return res.status(404).json({
        message:
          'Order not found for ID: and request body is ' + _id + ' ' + req.body,
      });
    }

    return res.json({
      message: 'Order updated successfully.',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

handler.delete(async (req, res) => {
  try {
    // get the id by parameter
    const { _id } = req.query;

    // const { _id } = req.body;
    await db.connectDb();

    const order = await Order.findByIdAndDelete(_id);

    await db.disConnectDb();

    if (!order) {
      return res.status(404).json({ message: 'Order not found for ID:', _id });
    }

    return res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default handler;
