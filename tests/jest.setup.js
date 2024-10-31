const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Read and parse the JSON data
const mockDataPath = path.resolve(__dirname, './__mocks__/mockData.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));

beforeAll(async () => {
  await prisma.$connect();
  
  // Clean up any existing data and reset sequences
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE "Order_id_seq" RESTART WITH 1;`;
  await prisma.$queryRaw`ALTER SEQUENCE "Payment_id_seq" RESTART WITH 1;`;

  // Seed inline data for Mav's tests
  await prisma.order.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      orderNumber: 1,
      payment: {
        create: {
          cardNumber: '4111111111111111',
          expMonth: '12',
          expYear: '2023',
          cvv: '123',
        },
      },
    },
  });

  // Seed data from mockData.json
  for (const order of mockData.seedOrders) {
    await prisma.order.create({
      data: order,
    });
  }
});

afterAll(async () => {
  // Clean up after tests
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  
  await prisma.$disconnect();
});
