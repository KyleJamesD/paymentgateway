const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Read and parse the JSON data
const mockDataPath = path.resolve(__dirname, './__mocks__/mockData.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));


beforeAll(async () => {
  await prisma.$connect();
  
  // Clean up any existing data
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE "Order_id_seq" RESTART WITH 1;`;
  await prisma.$queryRaw`ALTER SEQUENCE "Payment_id_seq" RESTART WITH 1;`;
  
  // Seed some initial data for both tables
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
