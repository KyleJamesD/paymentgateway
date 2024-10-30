/************************************Kyles Tests begin*************************************** */

// simple.test.js

describe('Basic Math Operations', () => {
  test('1 + 1 should equal 2', () => {
    expect(1 + 1).toBe(2);
  });
});

/********************************************************************************* */

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


/********************************************************************************* */

const handleInputChange = (formData, setFormData) => (e) => {
setFormData({
  ...formData,
  [e.target.name]: e.target.value,
});
};

// Test suite
describe('handleInputChange', () => {
it('should update formData state on input change', () => {
  // Initial formData
  const formData = { username: '' };

  // Mock function to simulate setFormData
  const setFormData = jest.fn();

  // Create a mock event
  const event = {
    target: {
      name: 'username',
      value: 'new_username',
    },
  };

  // Call the handleInputChange function
  handleInputChange(formData, setFormData)(event);

  // Check if setFormData was called with the correct argument
  expect(setFormData).toHaveBeenCalledWith({
    username: 'new_username',
  });
});
});


/********************************************************************************* */

// Mocking useState to keep track of the form data
let cardNumber = "";
let expMonth = "";
let expYear = "";
let cvv = "";
const formData = {
name: "",
email: "",
address: "",
city: "",
state: "",
zip: "",
};

// Mocking the set functions
const setCardNumber = jest.fn((value) => {
cardNumber = value;
});
const setExpMonth = jest.fn((value) => {
expMonth = value;
});
const setExpYear = jest.fn((value) => {
expYear = value;
});
const setCvv = jest.fn((value) => {
cvv = value;
});
const setFormData = jest.fn((data) => {
Object.assign(formData, data);
});

// The handleSubmit function
const handleSubmit = async (e) => {
e.preventDefault(); // Prevent default form submission
const randomOrderNumber = Math.floor(Math.random() * 1000000); // Generate random order number

// Ensure expMonth, expYear, and cvv are captured in the form submission data
const formDataWithCard = {
  ...formData,
  cardNumber,
  expMonth,
  expYear,
  cvv,
  orderNumber: randomOrderNumber,
};
setFormData(formDataWithCard);
// Here you would typically handle the form submission (e.g., send to an API)
};

// Test suite
describe('handleSubmit', () => {
it('should create formDataWithCard with correct values', async () => {
  // Simulate setting card details
  setCardNumber('1234567812345678');
  setExpMonth('12');
  setExpYear('25');
  setCvv('123');

  // Create a mock event
  const event = {
    preventDefault: jest.fn(),
  };

  // Call the handleSubmit function
  await handleSubmit(event);

  // Check if preventDefault was called
  expect(event.preventDefault).toHaveBeenCalled();

  // Check that the formDataWithCard contains the correct values
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