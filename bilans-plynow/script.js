document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fluidForm');
    const resultSection = document.getElementById('results');
    const clearBtn = document.getElementById('clearForm');

    // Inputs
    const milkInput = document.getElementById('milk');
    const waterInput = document.getElementById('water');
    const otherFluidsInput = document.getElementById('otherFluids');
    const diaperWeightInput = document.getElementById('diaperWeight');
    const urineAmountInput = document.getElementById('urineAmount');

    // Result elements
    const totalIntakeEl = document.getElementById('totalIntake');
    const totalOutputEl = document.getElementById('totalOutput');
    const balanceEl = document.getElementById('balance');
    const balanceInfoEl = document.getElementById('balanceInfo');

    // Tab state
    let activeTab = 'diaper'; // 'diaper' or 'urine'

    // Tab Logic
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // UI Update
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const tabId = tab.dataset.tab;
            document.getElementById(`${tabId}-content`).classList.add('active');

            activeTab = tabId;

            // Clear the inactive input
            if (activeTab === 'diaper') {
                urineAmountInput.value = '';
            } else {
                diaperWeightInput.value = '';
            }
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateBalance();
    });

    // Clear form
    clearBtn.addEventListener('click', () => {
        form.reset();
        resultSection.style.display = 'none';
    });

    function calculateBalance() {
        // Get input values
        const milk = parseFloat(milkInput.value) || 0;
        const water = parseFloat(waterInput.value) || 0;
        const otherFluids = parseFloat(otherFluidsInput.value) || 0;
        
        // Calculate total intake
        const totalIntake = milk + water + otherFluids;

        // Calculate output based on active tab
        let totalOutput = 0;
        if (activeTab === 'diaper') {
            const diaperWeight = parseFloat(diaperWeightInput.value) || 0;
            // Approximate conversion: 1g of urine ≈ 1ml (density of urine is close to water)
            totalOutput = diaperWeight;
        } else {
            totalOutput = parseFloat(urineAmountInput.value) || 0;
        }

        // Calculate balance
        const balance = totalIntake - totalOutput;

        // Display results
        displayResults(totalIntake, totalOutput, balance);
    }

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

