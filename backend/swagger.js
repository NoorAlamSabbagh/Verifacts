const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini Case Tracker API',
      version: '1.0.0',
      description: 'API documentation for Mini Case Tracker application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://your-vercel-backend-url.vercel.app',
        description: 'Production server (replace with your actual URL)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Cases', description: 'Case management endpoints' },
      { name: 'Documents', description: 'Document upload/download endpoints' },
      { name: 'Comments', description: 'Case comments endpoints' },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
