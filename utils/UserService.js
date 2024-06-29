import { Order } from '@/models/Order'; // Ensure the import path is correct
import db from '@/utils/db'; // Confirm the import path for db utility

export const updateOrder = async (id, data) => {
  try {
    await db.connectDb(); // Assuming db.connectDb() correctly establishes the database connection
    const order = await Order.findByIdAndUpdate(id, data, { new: true }); // Add { new: true } to return the updated order
    console.log('Order updated successfully', order);
    await db.disConnectDb(); // Assuming db.disConnectDb() correctly disconnects from the database
    return order; // Return the updated order
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error( // Consider using a more concise error message or handling specific error cases
      'Error updating order:',
      error.response?.data?.message ||
        error.response?.data ||
        error.response ||
        error.response?.data?.error ||
        error.response?.message ||
        error.message ||
        error
    );
  } finally {
    await db.disConnectDb(); // Ensure the database connection is properly closed in the finally block
  }
};

export const deleteUser = async (id) => {
  await db.connectDb();
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  } finally {
    await db.disConnectDb();
  }
};
