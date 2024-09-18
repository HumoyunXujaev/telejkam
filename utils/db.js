import mongoose from 'mongoose';

const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  if (mongoose?.connections?.length > 0) {
    connection.isConnected = mongoose?.connections?.[0]?.readyState;
    if (connection?.isConnected === 1) {
      console.log('Use previous connection to the database.');
      return;
    }
    await mongoose.disconnect();
  }

  // New connection to the database
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 15,  // Adjust the pool size as needed
    });
    console.log('New connection to the database.');
    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

async function disConnectDb() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
      console.log('Disconnected from the database in production.');
    } else {
      console.log('No need to disconnect from the database in development.');
    }
  }
}

const db = { connectDb, disConnectDb };

export default db;
