function addRow() {
    const tbody = document.querySelector('#routeTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="form-control route"></td>
        <td><input type="number" class="form-control tickets"></td>
        <td><input type="number" class="form-control price"></td>
        <td><input type="number" class="form-control total" readonly></td>
    `;
    tbody.appendChild(row);
    addRowListeners(row);
}

function addRowListeners(row) {
    const tickets = row.querySelector('.tickets');
    const price = row.querySelector('.price');
    const total = row.querySelector('.total');
    
    const updateTotal = () => {
        total.value = tickets.value * price.value;
        updateGrandTotals();
    };
    
    tickets.addEventListener('input', updateTotal);
    price.addEventListener('input', updateTotal);
}

function updateGrandTotals() {
    let totalTickets = 0;
    let totalAmount = 0;
    
    document.querySelectorAll('#routeTable tbody tr').forEach(row => {
        const tickets = parseFloat(row.querySelector('.tickets').value) || 0;
        const total = parseFloat(row.querySelector('.total').value) || 0;
        totalTickets += tickets;
        totalAmount += total;
    });
    
    document.getElementById('totalTickets').textContent = totalTickets;
    document.getElementById('totalAmount').textContent = totalAmount;
    updateCollectionSummary(totalAmount);
}

function updateCollectionSummary(manualCollection) {
    const onlineCollection = parseFloat(document.getElementById('onlineCollection').value) || 0;
    const pcAmount = parseFloat(document.getElementById('pcAmount').value) || 0;
    const advance = parseFloat(document.getElementById('advance').value) || 0;
    
    const manualCommission = manualCollection * 0.10;
    const onlineCommission = onlineCollection * 0.05;
    const totalCommission = manualCommission + onlineCommission + pcAmount;
    const balance = manualCollection - (totalCommission + advance);
    
    document.getElementById('manualCollection').textContent = manualCollection;
    document.getElementById('manualCommission').textContent = manualCommission.toFixed(2);
    document.getElementById('onlineCommission').textContent = onlineCommission.toFixed(2);
    document.getElementById('totalCommission').textContent = totalCommission.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
}

function shareWhatsApp() {
    const balance = document.getElementById('balance').textContent;
    const message = encodeURIComponent(
        `🚍 *Madurai Pandian Travels Statement*\n\n` +
        `📅 Date: ${document.getElementById('date').value}\n` +
        `🚛 Vehicle No & Time: ${document.getElementById('vehicleNo').value}\n` +
        `👤 Staff: ${document.getElementById('staff').value}\n` +
         `🧑‍💼Manual: ${document.querySelector('.manual-seat').value} | ` +
          `🌐Online: ${document.querySelector('.online-seat').value} | ` +
        `💺Vacant: ${document.querySelector('.vacant-seat').value}\n\n` +
        `📊 Total Collection: ₹${document.getElementById('totalAmount').textContent}\n` +
        `🪙 Total Commission: ₹${document.getElementById('totalCommission').textContent}\n` +
        `💰 Balance: ₹${balance}\n\n` +
        `_Generated via ANS Travels_`
    );
    window.open(`https://wa.me/?text=${message}`);
}

function preparePrint() {
    document.querySelectorAll('input').forEach(input => {
        input.setAttribute('readonly', 'true');
        if (input.type === 'number' && input.value) {
            input.value = parseFloat(input.value).toLocaleString('en-IN');
        }
    });
    
    window.print();
    
    document.querySelectorAll('input').forEach(input => {
        input.removeAttribute('readonly');
        if (input.type === 'number' && input.value) {
            input.value = input.value.replace(/,/g, '');
        }
    });
}

// Initialize first row
addRow();
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateGrandTotals);
});
