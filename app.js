document.addEventListener('DOMContentLoaded', function() {
    const contactsCSVTextarea = document.getElementById('contacts-csv');
    const transactionsCSVTextarea = document.getElementById('transactions-csv');
    const processButton = document.getElementById('process-button');
    const resultsContainer = document.getElementById('results-container');
    const resultsTableBody = document.getElementById('results-table-body');
    const downloadButton = document.getElementById('download-button');

    processButton.addEventListener('click', function() {
        const contactsCSV = contactsCSVTextarea.value;
        const transactionsCSV = transactionsCSVTextarea.value;

        if (!contactsCSV || !transactionsCSV) {
            alert('Please upload both contacts and transactions CSV files.');
            return;
        }

        try {
            const results = processContacts(contactsCSV, transactionsCSV);
            displayResults(results);
        } catch (error) {
            console.error('Error processing data:', error);
            alert('An error occurred while processing the data. Please check the console for details.');
        }
    });

    downloadButton.addEventListener('click', function() {
        const results = [];
        const rows = resultsTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const result = {
                email: cells[0].textContent,
                name: cells[1].textContent,
                ltv: parseFloat(cells[2].textContent),
                segment: cells[3].textContent
            };
            results.push(result);
        });

        const csv = Papa.unparse(results);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'segmented_contacts.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    function displayResults(results) {
        resultsTableBody.innerHTML = '';

        results.forEach(result => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-50';

            const emailCell = document.createElement('td');
            emailCell.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900';
            emailCell.textContent = result.email;

            const nameCell = document.createElement('td');
            nameCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
            nameCell.textContent = result.name;

            const ltvCell = document.createElement('td');
            ltvCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
            ltvCell.textContent = result.ltv.toFixed(2);

            const segmentCell = document.createElement('td');
            segmentCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
            segmentCell.textContent = result.segment;

            row.appendChild(emailCell);
            row.appendChild(nameCell);
            row.appendChild(ltvCell);
            row.appendChild(segmentCell);

            resultsTableBody.appendChild(row);
        });

        resultsContainer.classList.remove('hidden');
    }
});