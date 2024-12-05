console.time('expenses');

let array = JSON.parse(localStorage.getItem('expenses')) || [];
let editIndex = -1;
const tableBody = document.getElementById('tbodyId');

document.getElementById('search').addEventListener('input', () => {
    const search = document.getElementById('search').value.toLowerCase();
    const filteredArray = array.filter((data) => {
        const filterData = data.description.toLowerCase().includes(search) || String(data.amount).includes(search);
        return filterData;
    }
    );
    if (filteredArray.length > 0) {
        renderTable(filteredArray);
        calculateTotal(filteredArray)
    } else {
        renderTable([])
        calculateTotal(filteredArray)
    }
})

function renderTable(dataArray) {
    tableBody.innerHTML = "";
    dataArray.forEach((item, index) => {
        const row = document.createElement('tr');
        row.classList.add('row')
        const descriptionCell = document.createElement('td');
        const amountCell = document.createElement('td');
        const actionCell = document.createElement('td');
        actionCell.classList.add('actionCell')
        descriptionCell.textContent = item.description;
        amountCell.textContent = item.amount;

        // Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('editButton')
        editButton.onclick = () => {
            document.getElementById('description').value = item.description;
            document.getElementById('amount').value = item.amount;
            editIndex = index;
        };

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('deleteButton')
        deleteButton.onclick = () => {
            array.splice(index, 1);
            updateLocalStorage();
            calculateTotal(array);
            renderTable(array);
            document.getElementById('description').value = '';
            document.getElementById('amount').value = '';
        };

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
        row.appendChild(descriptionCell);
        row.appendChild(amountCell);
        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });
}

function handleSubmit() {
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value.trim());
console.log('amount', amount)
    if (!description || !amount) {
        alert("Please enter a valid description and amount.");
        return;
    }

    if (editIndex > -1) {
        array[editIndex] = { description, amount };
        editIndex = -1;
    } else {
        array.push({ description, amount });
    }

    updateLocalStorage();
    calculateTotal(array);
    renderTable(array);

    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

function calculateTotal(array) {
    const total = array.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const totalElement = document.getElementById('totalExpenses');
    totalElement.textContent = `Total Expenses: ${total}`;
}

function updateLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(array));
}

document.addEventListener('DOMContentLoaded', () => {
    renderTable(array);
    calculateTotal(array);
});

console.timeEnd('expenses');
