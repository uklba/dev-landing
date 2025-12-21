document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('growthForm');
    const resultSection = document.getElementById('results');
    const fillSampleBtn = document.getElementById('fillSample');

    // Inputs
    const dobInput = document.getElementById('dob');
    const yearsInput = document.getElementById('years');
    const monthsInput = document.getElementById('months');
    const hiddenAgeInput = document.getElementById('age');
    const calcAgeHint = document.getElementById('calculated-age-hint');

    // Tab state
    let activeTab = 'dob'; // 'dob' or 'manual'

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
        });
    });

    // Date Calculation Logic
    dobInput.addEventListener('change', calculateAgeFromDob);

    function calculateAgeFromDob() {
        if (!dobInput.value) {
            hiddenAgeInput.value = '';
            calcAgeHint.textContent = 'Wybierz datę aby obliczyć wiek';
            return;
        }

        const dob = new Date(dobInput.value);
        const today = new Date();

        // Difference in months (precise float)
        // Average days in month ~ 30.4375
        const diffTime = Math.abs(today - dob);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const ageInMonths = diffDays / 30.4375;

        hiddenAgeInput.value = ageInMonths.toFixed(2);

        // Friendly text
        const years = Math.floor(diffDays / 365.25);
        const remainingDays = diffDays % 365.25;
        const months = Math.floor(remainingDays / 30.4375);
        const weeks = Math.floor((remainingDays % 30.4375) / 7);

        let hintText = '';
        if (years > 0) hintText += `${years} l. `;
        if (months > 0) hintText += `${months} mies. `;
        if (weeks > 0 && years < 1) hintText += `${weeks} tyg.`; // Show weeks mostly for infants
        if (hintText === '') hintText = '< 1 tyg.';

        calcAgeHint.textContent = `Wiek: ${hintText} (${ageInMonths.toFixed(1)} mies.)`;
    }

    // Chart instance
    let growthChart = null;

    // Sample data button
    fillSampleBtn.addEventListener('click', () => {
        // Set tab to Manual
        document.querySelector('[data-tab="manual"]').click();

        yearsInput.value = 2;
        monthsInput.value = 0;
        document.getElementById('weight').value = 12.5;
        document.getElementById('height').value = 88;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Calculate Age based on active tab
        let ageInMonths = 0;

        if (activeTab === 'dob') {
            ageInMonths = parseFloat(hiddenAgeInput.value);
            // Re-calc if user didn't change input but hit enter? Input change handles it. 
            // If empty, try to calc
            if (isNaN(ageInMonths) && dobInput.value) {
                calculateAgeFromDob();
                ageInMonths = parseFloat(hiddenAgeInput.value);
            }
        } else {
            const y = parseFloat(yearsInput.value) || 0;
            const m = parseFloat(monthsInput.value) || 0;
            ageInMonths = (y * 12) + m;
            hiddenAgeInput.value = ageInMonths;
        }

        const formData = new FormData(form);
        const weight = parseFloat(formData.get('weight'));
        const height = parseFloat(formData.get('height'));
        const gender = formData.get('gender'); // 'boys' or 'girls'

        if (isNaN(ageInMonths) || ageInMonths < 0) {
            alert('Proszę podać poprawny wiek lub datę urodzenia.');
            return;
        }

        // Calculate and Show Results
        resultSection.style.display = 'block';

        let weightPercentile = '--';
        let heightPercentile = '--';

        if (!isNaN(weight)) {
            weightPercentile = calculatePercentile(gender, 'weight', ageInMonths, weight);
        }

        if (!isNaN(height)) {
            heightPercentile = calculatePercentile(gender, 'height', ageInMonths, height);
        }

        // Update UI Text
        updateResultUI('weightPercentile', weightPercentile);
        updateResultUI('heightPercentile', heightPercentile);

        // Update Chart
        updateChart(gender, ageInMonths, weight, height);

        // Scroll to results on mobile
        if (window.innerWidth < 768) {
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    function updateResultUI(elementId, value) {
        const el = document.getElementById(elementId);
        if (typeof value === 'number') {
            el.textContent = value.toFixed(1);
        } else {
            el.textContent = '--';
        }
    }

    /**
     * Calculates Z-score and then Percentile
     */
    function calculatePercentile(gender, type, age, value) {
        const [L, M, S] = getLmsData(gender, type, age);

        let zScore;
        if (L !== 0) {
            zScore = (Math.pow((value / M), L) - 1) / (L * S);
        } else {
            zScore = Math.log(value / M) / S;
        }

        return zScoreToPercentile(zScore);
    }

    /**
     * Approximation of standard normal CDF
     */
    function zScoreToPercentile(z) {
        if (z < -6) return 0;
        if (z > 6) return 100;

        const erf = (x) => {
            const a1 = 0.254829592;
            const a2 = -0.284496736;
            const a3 = 1.421413741;
            const a4 = -1.453152027;
            const a5 = 1.061405429;
            const p = 0.3275911;

            const sign = (x >= 0) ? 1 : -1;
            x = Math.abs(x);

            const t = 1.0 / (1.0 + p * x);
            const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

            return sign * y;
        };

        const p = 0.5 * (1 + erf(z / Math.sqrt(2)));
        return p * 100;
    }

    function valueFromZ(gender, type, age, z) {
        const [L, M, S] = getLmsData(gender, type, age);
        if (L !== 0) {
            return M * Math.pow((1 + L * S * z), (1 / L));
        } else {
            return M * Math.exp(S * z);
        }
    }

    function updateChart(gender, currentAge, currentWeight, currentHeight) {
        const ctx = document.getElementById('growthChart').getContext('2d');

        let type = 'weight';
        let userValue = currentWeight;
        let yLabel = 'Waga (kg)';

        if (isNaN(currentWeight) && !isNaN(currentHeight)) {
            type = 'height';
            userValue = currentHeight;
            yLabel = 'Wzrost (cm)';
        }

        // Limit chart to relevant range if possible, or standard 0-60
        // If age > 60, show up to age + padding? Data is only for 0-60 though.
        let maxAge = 60;
        if (currentAge > 60) currentAge = 60; // Clamp for chart if out of range, though data might be missing

        const labels = Array.from({ length: maxAge + 1 }, (_, i) => i);

        const zScores = [-1.88, -1.04, 0, 1.04, 1.88];
        const lineLabels = ['3%', '15%', '50%', '85%', '97%'];
        const lineColors = ['#dfe6e9', '#b2bec3', '#636e72', '#b2bec3', '#dfe6e9'];

        const datasets = zScores.map((z, index) => {
            return {
                label: `Centyl ${lineLabels[index]}`,
                data: labels.map(m => valueFromZ(gender, type, m, z)),
                borderColor: lineColors[index],
                borderWidth: index === 2 ? 2 : 1,
                pointRadius: 0,
                fill: false,
                tension: 0.4
            };
        });

        if (!isNaN(userValue)) {
            datasets.push({
                label: 'Twoje dziecko',
                data: [{ x: currentAge, y: userValue }],
                borderColor: '#6C63FF',
                backgroundColor: '#6C63FF',
                pointRadius: 6,
                pointHoverRadius: 8,
                showLine: false,
                type: 'scatter'
            });
        }

        if (growthChart) {
            growthChart.destroy();
        }

        growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                scales: {
                    x: {
                        type: 'linear', // Use linear scale for better point positioning
                        title: { display: true, text: 'Wiek (miesiące)' },
                        ticks: { stepSize: 6 },
                        min: 0,
                        max: maxAge
                    },
                    y: {
                        title: { display: true, text: yLabel },
                        min: type === 'weight' ? 0 : 40
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            filter: function (item) {
                                return !item.text.includes('%') || item.text.includes('50%'); // Show only Median and User point to save space? Or just median
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }
});
