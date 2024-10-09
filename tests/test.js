const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// tests connection to the database
test('DB-01: Connection Verification', async () => {
  await prisma.$connect();
  const result = await prisma.$queryRaw`SELECT 1 + 1 AS result`;
  expect(result[0].result).toBe(2);
  await prisma.$disconnect();
});

// tests inserting an order into the database
test('should insert an order into the database', async () => {
  const order = await prisma.order.create({
    data: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: '456 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      orderNumber: 2,
    },
  });

  expect(order).toBeDefined();
  expect(order.name).toBe('Jane Doe');
});

// tests deleting an order
test('should delete an order', async () => {
  await prisma.order.delete({
    where: { id: 1 },
  });

  const order = await prisma.order.findUnique({
    where: { id: 1 },
  });

  expect(order).toBeNull();
});

// tests retrieving an order by id
test('should retrieve an order by id', async () => {
  const order = await prisma.order.findUnique({
    where: { id: 1 },
  });

  expect(order).toBeDefined();
  expect(order.name).toBe('John Doe');
});

// tests updating an order by id
test('should update an order by id', async () => {
  const updatedOrder = await prisma.order.update({
    where: { id: 1 },
    data: { name: 'John Updated' },
  });

  expect(updatedOrder.name).toBe('John Updated');
});

// tests unique constraint error when inserting duplicate orderNumber in Order
test('should throw unique constraint error when inserting duplicate orderId in Payment', async () => {
  await prisma.order.create({
    data: {
      name: 'John Day',
      email: 'john@example.com',
      address: '321 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10501',
      orderNumber: 3,
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

  await expect(
    prisma.order.create({
      data: {
        name: 'John Day',
        email: 'john@example.com',
        address: '321 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10501',
        orderNumber: 3,
        payment: {
          create: {
            cardNumber: '4111111111111111',
            expMonth: '12',
            expYear: '2023',
            cvv: '123',
          },
        },
      },
    })
  ).rejects.toThrow();
});

// tests fetching an order by id using supertest
// const request = require('supertest');
// const app = require('../app'); // Assuming you export the Next.js app for testing

// test('should fetch order by id', async () => {
//   const res = await request(app).get('/api/orders/1');
//   expect(res.statusCode).toEqual(200);
//   expect(res.body.name).toBe('John Doe');
// });

// tests transaction rollback on failure
test('should rollback transaction on failure', async () => {
  const prisma = new PrismaClient();

  const rollback = async () => {
    const result = await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          name: 'Temp User',
          email: 'temp@example.com',
          address: 'Somewhere',
          city: 'Some City',
          state: 'ST',
          zip: '00000',
          orderNumber: 100,
        },
      });
      throw new Error('Force rollback');
    });

    return result;
  };

  await expect(rollback()).rejects.toThrow('Force rollback');
  
  const order = await prisma.order.findUnique({ where: { orderNumber: 100 } });
  expect(order).toBeNull(); // Ensure it was rolled back
});

// tests order not found code 404
test('should return 404 if order not found', async () => {
  const res = await request(app).get('/api/orders/999');
  expect(res.statusCode).toEqual(404);
});


