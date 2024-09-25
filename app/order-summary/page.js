// app/order-summary/page.js
'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function OrderSummary() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSummaryContent />
    </Suspense>
  );
}

function OrderSummaryContent() {
  const searchParams = useSearchParams();
  
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const address = searchParams.get('address');
  const cardNumber = searchParams.get('cardNumber');
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="p-6 bg-white shadow-lg max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Order Summary</h1>
      <p><strong>Order Number:</strong> {orderNumber}</p>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Card Number:</strong> {cardNumber}</p>
    </div>
  );
}