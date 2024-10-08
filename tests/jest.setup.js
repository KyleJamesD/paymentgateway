const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
  
  // Clean up any existing data
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  
  // Seed some initial both tables
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
});

afterAll(async () => {
  // Clean up after tests
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  
  await prisma.$disconnect();
});
