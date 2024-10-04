import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the JSON body from the request
    const { name, email, address, city, state, zip, cardNumber, expMonth, expYear, cvv, orderNumber } = await request.json();
    console.log("Received data in API:", { name, email, address, city, state, zip, cardNumber, expMonth, expYear, cvv, orderNumber });

    // Simulate saving the order and payment details to the database
    const order = await prisma.order.create({
      data: {
        name,
        email,
        address,
        city,
        state,
        zip,
        orderNumber,
        payment: {
          create: {
            cardNumber,
            expMonth,
            expYear,
            cvv,
          },
        },
      },
    });    

    console.log("Order created in the database:", order);

    // Return a successful response
    return new Response(JSON.stringify({ message: 'Order created successfully', order }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error saving order:', error);

    // Return an error response
    return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  });
}
