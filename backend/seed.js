const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await User.deleteMany({});
    console.log('Users cleared');

    const users = [
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'password123',
        role: 'Manager'
      },
      {
        name: 'Agent 1',
        email: 'agent1@example.com',
        password: 'password123',
        role: 'Agent'
      },
      {
        name: 'Agent 2',
        email: 'agent2@example.com',
        password: 'password123',
        role: 'Agent'
      },
      {
        name: 'Agent 3',
        email: 'agent3@example.com',
        password: 'password123',
        role: 'Agent'
      }
    ];

    await User.create(users);
    console.log('Users added: 1 Manager, 3 Agents');

    console.log('Seed complete!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
