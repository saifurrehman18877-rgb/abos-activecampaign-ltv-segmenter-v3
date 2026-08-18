const assert = require('assert');
const { parseCSV, calculateLTV, determineSegment, processContacts } = require('./logic');

const testCSV = `email,name,amount
test@example.com,Test User,100.50
test@example.com,Test User,200.75
other@example.com,Other User,300.25`;

const testTransactions = [
    { email: 'test@example.com', amount: '100.50' },
    { email: 'test@example.com', amount: '200.75' },
    { email: 'other@example.com', amount: '300.25' }
];

const testContacts = [
    { email: 'test@example.com', name: 'Test User' },
    { email: 'other@example.com', name: 'Other User' }
];

// Test parseCSV
assert.deepStrictEqual(parseCSV(testCSV), testTransactions);

// Test calculateLTV
assert.strictEqual(calculateLTV(testTransactions), 601.5);

// Test determineSegment
assert.strictEqual(determineSegment(601.5), 'VIP/High-Value');
assert.strictEqual(determineSegment(500), 'Mid-Tier');
assert.strictEqual(determineSegment(499.99), 'Low-Tier');

// Test processContacts
const contactsCSV = `email,name
test@example.com,Test User
other@example.com,Other User`;

const transactionsCSV = `email,amount
test@example.com,100.50
test@example.com,200.75
other@example.com,300.25`;

const expectedOutput = [
    { email: 'test@example.com', name: 'Test User', ltv: 301.25, segment: 'Mid-Tier' },
    { email: 'other@example.com', name: 'Other User', ltv: 300.25, segment: 'Mid-Tier' }
];

assert.deepStrictEqual(processContacts(contactsCSV, transactionsCSV), expectedOutput);