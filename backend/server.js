const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

dotenv.config();

connectDB();

const auth = require('./routes/auth');
const cases = require('./routes/cases');

const app = express();

// Configure CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL, // Production frontend URL from environment variable
  'https://verifacts-ejcm-git-main-nooralamsabbaghs-projects.vercel.app',
];

// Filter out any undefined origins from the list
const validOrigins = allowedOrigins.filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // In development mode, allow any origin for easier testing
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    // In production, only allow specific origins
    if (!origin || validOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', auth);
app.use('/api/cases', cases);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
