import db from '@/utils/db';
import { User } from '@/models/User';
import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import { id } from 'date-fns/locale';
import { createRouter } from 'next-connect';
const router = createRouter().use(auth).use(admin);

router.put(async (req, res) => {
  try {
    const { _id, role, emailVerified } = req.body;
    await db.connectDb();

    console.log('Request Body:', req.body);
    console.log('_id:', _id);

    const user = await User.findByIdAndUpdate(
      _id,
      { role, emailVerified },
      { new: true }
    );

    await db.disConnectDb();

    if (!user) {
      return res.status(404).json({
        message:
          'User not found for ID: and request body is ' + id + ' ' + req.body,
      });
    }

    return res.json({
      message: 'User updated successfully.',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete(async (req, res) => {
  try {
    const { id } = req.query;
    // const { _id } = req.body;
    await db.connectDb();

    const user = await User.findByIdAndDelete(id);

    await db.disConnectDb();

    if (!user) {
      return res.status(404).json({
        message: 'User not found for ID: ' + id,
      });
    }

    return res.json({
      message: 'User deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
