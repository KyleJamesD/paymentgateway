
const { performance } = require('perf_hooks'); // Import performance for measuring time

// Mock credit card data
const validCreditCard = "4111111111111111"; // Visa Test Card
const invalidCreditCard = "1234567812345678"; // Invalid Card Number

// Mock function to validate credit card format and carrier (basic validation)
function validateCreditCard(cardNumber) {
  const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/; // Basic Visa format validation
  const masterCardRegex = /^5[1-5][0-9]{14}$/; // Basic Mastercard format validation

  if (visaRegex.test(cardNumber)) {
    return { isValid: true, carrier: "Visa" };
  } else if (masterCardRegex.test(cardNumber)) {
    return { isValid: true, carrier: "MasterCard" };
  } else {
    return { isValid: false, carrier: "Unknown" };
  }
}

// Jest test for Credit Card Validation Performance
test('PF-04: Credit Card Validation Performance', () => {
  const start = performance.now(); // Start time

  // Perform validation
  const result = validateCreditCard(validCreditCard);

  const end = performance.now(); // End time
  const timeTaken = end - start; // Time taken in milliseconds

  console.log(`Credit card validation took ${timeTaken} ms`);

  // Assertions
  expect(result.isValid).toBe(true);
  expect(result.carrier).toBe('Visa');
  expect(timeTaken).toBeLessThan(100); // Ensure it took less than 100ms
});
