const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Read and parse the JSON data
const mockDataPath = path.resolve(__dirname, './__mocks__/mockData.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));

// tests connection to the database
test("DB-01: +Connection Verification", async () => {
  await prisma.$connect();
  const result = await prisma.$queryRaw`SELECT 1 + 1 AS result`;
  expect(result[0].result).toBe(2);
  await prisma.$disconnect();
});

// tests database connection using invalid credentials
test("DB-02: -Connection with Invalid Credentials", async () => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://invalid:invalid@localhost:5432/mydatabase',
      },
    },
  });
  expect(prisma.$connect()).rejects.toThrow();
});

// tests inserting an order into the database
test('DB-03: +Insert Valid Data', async () => {
  const insertData = mockData.insertData;
  const order = await prisma.order.create({
    data: insertData
  });

  expect(order).toBeDefined();
  expect(order.name).toBe('Jane Doe');

  // rollback the insert operation
  await prisma.payment.delete({
    where: { id: order.id }
  });
  await prisma.order.delete({
    where: { id: order.id }
  });
});

// tests inserting invalid data into the database
test('DB-04: -Insert with Invalid OrderNumber', async () => {
  const invalidOrderNumberData = mockData.invalidOrderNumberData;
  await expect(prisma.order.create({
    data: invalidOrderNumberData // invalid data contains orderNumber that already exists in seed data
  })).rejects.toThrow();
});

// tests inserting invalid credit card data into the database
test('DB-05: -Insert Invalid Credit Card Data', async () => {
  const invalidCardNumberData = mockData.invalidCardNumberData;
  await expect(prisma.payment.create({
    data: invalidCardNumberData // invalid data contains invalid credit card number
  })).rejects.toThrow();
});

// tests deleting an order
test('DB-06: +Delete a Row', async () => {
  const deletePayment = await prisma.payment.delete({
    where: { orderId: 1 }
  });
  const deleteOrder = await prisma.order.delete({
    where: { id: 1 }
  });
  
  const order = await prisma.order.findUnique({
    where: { id: 1 }
  });
  expect(order).toBeNull();

  const payment = await prisma.payment.findUnique({
    where: { orderId: 1 }
  });
  expect(payment).toBeNull();

  // rollback the delete operation
  await prisma.order.create({
    data: {...mockData.seedOrders[0], id: 1}
  });
});

// Tests whether data can be deleted from the database when the foreign constraint is being violated.
test('DB-07: -Delete a Row with Foreign Constraint', async () => {
  await expect(prisma.order.delete({
    where: { id: 1 }
  })).rejects.toThrow();
});

// tests retrieving an order by id
test('DB-08: +Retrieve Data', async () => {
  const order = await prisma.order.findUnique({
    where: { id: 1 },
  });

  expect(order).toBeDefined();
  expect(order.name).toBe('John Doe');
});

// tests updating an order by id
test('DB-09: +Update Data', async () => {
  const updatedOrder = await prisma.order.update({
    where: { id: 1 },
    data: { name: 'John Doe Jr.' },
  });

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder.name).toBe('John Doe Jr.');

  // rollback the update operation
  await prisma.order.update({
    where: { id: 1 },
    data: { name: 'John Doe' },
  });
});

// tests updating an order with invalid data
test('DB-10: -Update Data with Invalid Data', async () => {
  await expect(prisma.order.update({
    where: { id: 1 },
    data: { name: 1 }, // attempts to update name with a number
  })).rejects.toThrow();
});

// tests logging of database actions
test('DB-12: +Log Database Actions', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation();
  await prisma.$connect();
  await prisma.$disconnect();
  expect(log).toHaveBeenCalledTimes(2);
  log.mockRestore();
});

// tests logging of database errors
// test('DB-13: +Log Database Errors', async () => {
//   const error = jest.spyOn(console, 'error').mockImplementation();
//   const prisma = new PrismaClient({
//     datasources: {
//       db: {
//         url: 'postgresql://invalid:invalid@localhost:5432/mydatabase',
//       },
//     },
//   });
//   await prisma.$connect();
//   expect(error).toHaveBeenCalledTimes(1);
//   error.mockRestore();
// });

// test that queries database metadata for logging activity
// test('DB-14: +Query Database Metadata', async () => {
//   const result = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
//   expect(result).toBeDefined();
// });