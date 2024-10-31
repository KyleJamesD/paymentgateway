const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// const request = require('supertest');
// const app = require('../app'); // Uncomment if you have an app export for supertest

/************************************ Kyles Tests begin ***************************************/

// simple.test.js
describe('Basic Math Operations', () => {
  test('1 + 1 should equal 2', () => {
    expect(1 + 1).toBe(2);
  });
});

/*********************************************************************************/

// formatCardNumber.js function
const formatCardNumber = (value) => {
  value = value.replace(/\s/g, "");
  if (!isNaN(value)) {
    value = value.match(/.{1,4}/g)?.join(" ") || "";
  }
  return value;
};

describe('formatCardNumber', () => {
  it('should format a continuous card number correctly', () => {
    const input = '1234567812345678';
    const output = formatCardNumber(input);
    expect(output).toBe('1234 5678 1234 5678');
  });

  it('should format a card number with spaces', () => {
    const input = '1234 5678 1234 5678';
    const output = formatCardNumber(input);
    expect(output).toBe('1234 5678 1234 5678');
  });
});

/*********************************************************************************/

// handleInputChange function
const handleInputChange = (formData, setFormData) => (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

describe('handleInputChange', () => {
  it('should update formData state on input change', () => {
    const formData = { username: '' };
    const setFormData = jest.fn();
    const event = { target: { name: 'username', value: 'new_username' } };
    handleInputChange(formData, setFormData)(event);
    expect(setFormData).toHaveBeenCalledWith({ username: 'new_username' });
  });
});

/*********************************************************************************/

// Mocking useState to keep track of the form data
let cardNumber = "", expMonth = "", expYear = "", cvv = "";
const formData = { name: "", email: "", address: "", city: "", state: "", zip: "" };

const setCardNumber = jest.fn((value) => { cardNumber = value; });
const setExpMonth = jest.fn((value) => { expMonth = value; });
const setExpYear = jest.fn((value) => { expYear = value; });
const setCvv = jest.fn((value) => { cvv = value; });
const setFormData = jest.fn((data) => { Object.assign(formData, data); });

// handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  const randomOrderNumber = Math.floor(Math.random() * 1000000);
  const formDataWithCard = {
    ...formData,
    cardNumber,
    expMonth,
    expYear,
    cvv,
    orderNumber: randomOrderNumber,
  };
  setFormData(formDataWithCard);
};

describe('handleSubmit', () => {
  it('should create formDataWithCard with correct values', async () => {
    setCardNumber('1234567812345678');
    setExpMonth('12');
    setExpYear('25');
    setCvv('123');
    const event = { preventDefault: jest.fn() };
    await handleSubmit(event);
    expect(event.preventDefault).toHaveBeenCalled();
    const randomOrderNumber = expect.any(Number);
    expect(setFormData).toHaveBeenCalledWith({
      ...formData,
      cardNumber: '1234567812345678',
      expMonth: '12',
      expYear: '25',
      cvv: '123',
      orderNumber: randomOrderNumber,
    });
  });
});

/************************************ Mav's Tests ***************************************/

// tests connection to the database
test('should connect to the database', async () => {
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

// Uncomment and complete if you have an app export for supertest
// test('should fetch order by id', async () => {
//   const res = await request(app).get('/api/orders/1');
//   expect(res.statusCode).toEqual(200);
//   expect(res.body.name).toBe('John Doe');
// });

test('should rollback transaction on failure', async () => {
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

// Uncomment and complete if you have an app export for supertest
// test('should return 404 if order not found', async () => {
//   const res = await request(app).get('/api/orders/999');
//   expect(res.statusCode).toEqual(404);
// });
