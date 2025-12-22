document.addEventListener('DOMContentLoaded', () => {
    const addIntakeBtn = document.getElementById('addIntakeRow');
    const addOutputBtn = document.getElementById('addOutputRow');
    const calculateBtn = document.getElementById('calculateSummary');
    const intakeTableBody = document.getElementById('intakeTableBody');
    const outputTableBody = document.getElementById('outputTableBody');
    const resultSection = document.getElementById('results');

    // Result elements
    const totalIntakeEl = document.getElementById('totalIntake');
    const totalOutputEl = document.getElementById('totalOutput');
    const balanceEl = document.getElementById('balance');
    const balanceInfoEl = document.getElementById('balanceInfo');

    // Row counters for unique IDs
    let intakeRowCounter = 0;
    let outputRowCounter = 0;

    // Add intake row
    addIntakeBtn.addEventListener('click', () => {
        addTableRow(intakeTableBody, 'intake', intakeRowCounter++);
    });

    // Add output row
    addOutputBtn.addEventListener('click', () => {
        addTableRow(outputTableBody, 'output', outputRowCounter++);
    });

    // Calculate summary
    calculateBtn.addEventListener('click', () => {
        calculateSummary();
    });

    // Function to add a table row
    function addTableRow(tableBody, type, rowId) {
        // Remove empty state if exists
        const emptyRow = tableBody.querySelector('.empty-state-row');
        if (emptyRow) {
            emptyRow.remove();
        }

        const row = document.createElement('tr');
        row.dataset.rowId = rowId;
        
        const volumeCell = document.createElement('td');
        const volumeInput = document.createElement('input');
        volumeInput.type = 'number';
        volumeInput.step = '1';
        volumeInput.min = '0';
        volumeInput.placeholder = 'ml';
        volumeInput.className = 'volume-input';
        volumeCell.appendChild(volumeInput);

        const timeCell = document.createElement('td');
        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.className = 'time-input';
        // Set default to current time
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeInput.value = `${hours}:${minutes}`;
        timeCell.appendChild(timeInput);

        const commentCell = document.createElement('td');
        const commentInput = document.createElement('textarea');
        commentInput.placeholder = 'Komentarz...';
        commentInput.className = 'comment-input';
        commentInput.rows = 1;
        commentCell.appendChild(commentInput);

        const actionCell = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove';
        removeBtn.textContent = 'Usuń';
        removeBtn.addEventListener('click', () => {
            row.remove();
            checkEmptyTable(tableBody);
        });
        actionCell.appendChild(removeBtn);

        row.appendChild(volumeCell);
        row.appendChild(timeCell);
        row.appendChild(commentCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);

        // Auto-resize textarea
        commentInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });

        // Focus on volume input
        volumeInput.focus();
    }

    // Check if table is empty and show message
    function checkEmptyTable(tableBody) {
        if (tableBody.children.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-state-row';
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 4;
            emptyCell.className = 'empty-state';
            emptyCell.textContent = 'Brak wpisów. Kliknij + aby dodać.';
            emptyRow.appendChild(emptyCell);
            tableBody.appendChild(emptyRow);
        }
    }

    // Initialize empty states
    checkEmptyTable(intakeTableBody);
    checkEmptyTable(outputTableBody);

    // Function to calculate summary
    function calculateSummary() {
        // Calculate total intake
        let totalIntake = 0;
        const intakeRows = intakeTableBody.querySelectorAll('tr:not(.empty-state-row)');
        intakeRows.forEach(row => {
            const volumeInput = row.querySelector('.volume-input');
            if (volumeInput && volumeInput.value) {
                const volume = parseFloat(volumeInput.value) || 0;
                totalIntake += volume;
            }
        });

        // Calculate total output
        let totalOutput = 0;
        const outputRows = outputTableBody.querySelectorAll('tr:not(.empty-state-row)');
        outputRows.forEach(row => {
            const volumeInput = row.querySelector('.volume-input');
            if (volumeInput && volumeInput.value) {
                const volume = parseFloat(volumeInput.value) || 0;
                totalOutput += volume;
            }
        });

        // Calculate balance
        const balance = totalIntake - totalOutput;

        // Display results
        displayResults(totalIntake, totalOutput, balance);
    }

    // Function to display results
    function displayResults(intake, output, balance) {
        // Display values
        totalIntakeEl.textContent = intake.toFixed(0);
        totalOutputEl.textContent = output.toFixed(0);
        balanceEl.textContent = balance.toFixed(0);

        // Remove previous color classes
        balanceEl.classList.remove('positive', 'negative', 'neutral');

        // Add appropriate color class
        if (balance > 0) {
            balanceEl.classList.add('positive');
        } else if (balance < 0) {
            balanceEl.classList.add('negative');
        } else {
            balanceEl.classList.add('neutral');
        }

        // Display balance info
        let infoText = '';
        let infoTitle = '';

        if (balance > 0) {
            infoTitle = 'Bilans dodatni';
            infoText = `Dziecko przyjęło ${balance.toFixed(0)} ml więcej płynów niż wydaliło. To normalna sytuacja, szczególnie u niemowląt.`;
        } else if (balance < 0) {
            infoTitle = 'Bilans ujemny';
            infoText = `Dziecko wydaliło ${Math.abs(balance).toFixed(0)} ml więcej niż przyjęło. Jeśli sytuacja się powtarza, skonsultuj się z lekarzem.`;
        } else {
            infoTitle = 'Bilans zrównoważony';
            infoText = 'Wpływy i wydaliny są równe. To idealna sytuacja, choć w praktyce rzadko osiągalna.';
        }

        balanceInfoEl.innerHTML = `
            <p class="info-title">${infoTitle}</p>
            <p>${infoText}</p>
            <p style="margin-top: 12px; font-size: 0.9rem; color: var(--text-muted);">
                <strong>Uwaga:</strong> To narzędzie ma charakter informacyjny. W przypadku niepokojących objawów zawsze skonsultuj się z lekarzem.
            </p>
        `;

        // Show results section
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
