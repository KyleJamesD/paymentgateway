'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const router = useRouter();

  const formatCardNumber = (value) => { 
    value = value.replace(/\s/g, '');
    if (!isNaN(value)) {
      value = value.match(/.{1,4}/g)?.join(' ') || '';
    }
    return value;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const randomOrderNumber = Math.floor(Math.random() * 1000000); // Generate random order number

    // Logging to check if handleSubmit is triggered
    console.log("Form submitted with data:", formData, cardNumber, randomOrderNumber);

    router.push(`/order-summary?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&address=${encodeURIComponent(formData.address)}&cardNumber=${encodeURIComponent(cardNumber)}&orderNumber=${randomOrderNumber}`);
  };

  return (
    <div className="bg-white p-5 shadow-lg w-[700px]">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-xl text-[#ED3717] mb-2">Billing Address</h3>

            <div className="mb-4">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="w-full border p-2 text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
                className="w-full border p-2 text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                required
                className="w-full border p-2 text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                required
                className="w-full border p-2 text-black"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="state">State:</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  required
                  className="w-full border p-2 text-black"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="zip">Zip Code:</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="123 456"
                  required
                  className="w-full border p-2 text-black"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[250px]">
            <h3 className="text-xl text-[#ED3717] mb-2">Payment</h3>

            <div className="mb-4">
<label htmlFor="cardName">Name On Card:</label>
<input type="text" id="cardName" placeholder="Enter card name" required className="w-full border p-2 text-black" />
</div>

            <div className="mb-4">
              <label htmlFor="cardNum">Credit Card Number:</label>
              <input
                type="text"
                id="cardNum"
                name="cardNum"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength="19"
                placeholder="1111-2222-3333-4444"
                required
                className="w-full border p-2 text-black"
              />
            </div>

            {/* Other payment fields... */}
            
            <div className="mb-4">
              <label>Exp Month:</label>
              <select className="w-full border p-2">
                <option value="">Choose month</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label>Exp Year:</label>
                <select className="w-full border p-2">
                  <option value="">Choose Year</option>
                  {[2023, 2024, 2025, 2026, 2027].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="cvv">CVV</label>
                <input type="number" id="cvv" placeholder="1234" required className="w-full border p-2" />
              </div>
            </div>


            <input
              type="submit"
              value="Proceed to Checkout"
              className="w-full p-3 bg-[#018F22] text-white cursor-pointer mt-4 hover:bg-[#3d17fb]"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
















