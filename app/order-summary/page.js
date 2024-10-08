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
      <h1 className="text-2xl font-bold text-black">Order Summary</h1>
      <p className="text-black"><strong className="text-black">Order Number:</strong> {orderNumber}</p>
      <p className="text-black"><strong className="text-black">Name:</strong> {name}</p>
      <p className="text-black"><strong className="text-black">Email:</strong> {email}</p>
      <p className="text-black"><strong className="text-black">Address:</strong> {address}</p>
      <p className="text-black"><strong className="text-black">Card Number:</strong> {cardNumber}</p>
    </div>
  );
}