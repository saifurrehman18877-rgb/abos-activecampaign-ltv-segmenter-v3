const Papa = typeof require !== 'undefined' ? require('papaparse') : window.Papa;

function parseCSV(csvString) {
    return Papa.parse(csvString, { header: true, skipEmptyLines: true }).data;
}

function calculateLTV(transactions) {
    return transactions.reduce((total, transaction) => {
        const amount = parseFloat(transaction.amount);
        return total + (isNaN(amount) ? 0 : amount);
    }, 0);
}

function determineSegment(ltv) {
    if (ltv >= 1000) return 'VIP/High-Value';
    if (ltv >= 500) return 'Mid-Tier';
    return 'Low-Tier';
}

function processContacts(contactsCSV, transactionsCSV) {
    const contacts = parseCSV(contactsCSV);
    const transactions = parseCSV(transactionsCSV);

    const contactTransactions = transactions.reduce((acc, transaction) => {
        const email = transaction.email;
        if (!acc[email]) acc[email] = [];
        acc[email].push(transaction);
        return acc;
    }, {});

    return contacts.map(contact => {
        const email = contact.email;
        const ltv = calculateLTV(contactTransactions[email] || []);
        const segment = determineSegment(ltv);
        return { ...contact, ltv, segment };
    });
}

if (typeof module !== 'undefined') module.exports = {
    parseCSV,
    calculateLTV,
    determineSegment,
    processContacts
};