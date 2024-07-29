import db from '@/utils/db';
import { User } from '@/models/User';
import auth from '@/middleware/auth';
import admin from '@/middleware/admin';
import { createRouter } from 'next-connect';

const router = createRouter().use(auth).use(admin);

router.put(async (req, res) => {
  try {
    const { _id, role, emailVerified } = req.body;
    await db.connectDb();

    const user = await User.findByIdAndUpdate(
      _id,
      { role, emailVerified },
      { new: true }
    );

    await db.disConnectDb();

    if (!user) {
      return res.status(404).json({
        message: `User not found for ID: ${_id}`,
      });
    }

    return res.json({
      message: 'User updated successfully.',
      user,
    });
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

router.delete(async (req, res) => {
  try {
    const { id } = req.query;
    await db.connectDb();

    const user = await User.findByIdAndDelete(id);

    await db.disConnectDb();

    if (!user) {
      return res.status(404).json({
        message: `User not found for ID: ${id}`,
      });
    }

    return res.json({
      message: 'User deleted successfully.',
    });
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

router.post(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    await db.connectDb();

    const user = await User.create({
      name,
      email,
      password,
      role,
      emailVerified: true,
    });

    await db.disConnectDb();

    return res.status(201).json({
      message: 'User created successfully.',
      user,
    });
  } catch (error) {
    await db.disConnectDb();
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
