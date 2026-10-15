/**
 * Aplikasi Kalkulator Modern
 * Mendukung perhitungan aritmatika, riwayat perhitungan,
 * tema gelap/terang, dan input keyboard.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // SELEKTOR ELEMEN DOM
    // ==========================================
    const previousOperandText = document.getElementById('previous-operand');
    const currentOperandText = document.getElementById('current-operand');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const historyToggleBtn = document.getElementById('history-toggle-btn');
    const historyPanel = document.getElementById('history-panel');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // ==========================================
    // STATE KALKULATOR
    // ==========================================
    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let shouldResetScreen = false;
    let isCalculated = false;
    let calculationHistory = JSON.parse(localStorage.getItem('calc_history') || '[]');

    // ==========================================
    // INISIALISASI
    // ==========================================
    initTheme();
    renderHistory();
    updateDisplay();

    // ==========================================
    // EVENT LISTENERS TOMBOL
    // ==========================================
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            updateDisplay();
        });
    });

    document.querySelectorAll('[data-operator]').forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.getAttribute('data-operator'));
            updateDisplay();
        });
    });

    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            handleAction(action);
        });
    });

    // Toggle Panel Riwayat
    historyToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        historyPanel.classList.toggle('active');
    });

    // Tutup panel riwayat jika klik di luar area riwayat
    document.addEventListener('click', (e) => {
        if (!historyPanel.contains(e.target) && !historyToggleBtn.contains(e.target)) {
            historyPanel.classList.remove('active');
        }
    });

    // Hapus Riwayat
    clearHistoryBtn.addEventListener('click', () => {
        calculationHistory = [];
        localStorage.removeItem('calc_history');
        renderHistory();
    });

    // Ganti Tema
    themeToggleBtn.addEventListener('click', toggleTheme);

    // ==========================================
    // LOGIKA KALKULATOR
    // ==========================================
    function appendNumber(number) {
        if (isCalculated) {
            previousOperand = '';
            isCalculated = false;
        }

        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
            return;
        }

        if (shouldResetScreen) {
            currentOperand = number === '.' ? '0.' : number;
            shouldResetScreen = false;
            return;
        }

        // Mencegah tanda titik/koma desimal ganda
        if (number === '.' && currentOperand.includes('.')) return;

        // Batasi panjang angka maksimal 15 digit
        const rawDigits = currentOperand.replace(/[^0-9]/g, '');
        if (rawDigits.length >= 15) return;

        currentOperand += number;
    }

    function chooseOperation(op) {
        if (op === '-') op = '−';
        if (op === '/') op = '÷';
        if (op === '*') op = '×';

        if (currentOperand === 'Tak terhingga' || currentOperand === 'Error') {
            clearAll();
            return;
        }

        if (isCalculated) {
            isCalculated = false;
        }

        if (operation !== null && !shouldResetScreen) {
            compute(false);
        }

        operation = op;
        previousOperand = `${currentOperand} ${operation}`;
        shouldResetScreen = true;
    }

    function compute(fromEquals = false) {
        if (operation === null || shouldResetScreen) {
            if (fromEquals && !isCalculated) {
                // Jika hanya menekan sama dengan tanpa operator
                return;
            }
            if (!fromEquals) return;
        }

        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        let result;
        const rawExpression = `${previousOperand} ${currentOperand}`;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
            case '−':
                result = prev - current;
                break;
            case '×':
            case '*':
                result = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    currentOperand = 'Tak terhingga';
                    previousOperand = `${formatDisplayNumber(prev)} ÷ 0 =`;
                    operation = null;
                    shouldResetScreen = true;
                    isCalculated = true;
                    updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        result = formatPrecision(result);

        // Format ekspresi untuk riwayat dan tampilan atas
        const formattedPrev = formatDisplayNumber(prev);
        const formattedCurr = formatDisplayNumber(current);
        const readableExpression = `${formattedPrev} ${operation} ${formattedCurr}`;

        saveHistory(readableExpression, result);

        currentOperand = result.toString();
        if (fromEquals) {
            previousOperand = `${readableExpression} =`;
            operation = null;
            isCalculated = true;
        } else {
            previousOperand = `${currentOperand} ${operation}`;
        }

        shouldResetScreen = true;
        updateDisplay();
    }

    function handleAction(action) {
        switch (action) {
            case 'clear':
                clearAll();
                break;
            case 'delete':
                deleteLastChar();
                break;
            case 'calculate':
                compute(true);
                break;
            case 'percent':
                calculatePercent();
                break;
            case 'toggle-sign':
                toggleSign();
                break;
        }
        updateDisplay();
    }

    function clearAll() {
        currentOperand = '0';
        previousOperand = '';
        operation = null;
        shouldResetScreen = false;
        isCalculated = false;
    }

    function deleteLastChar() {
        if (isCalculated || shouldResetScreen || currentOperand === 'Error' || currentOperand === 'Tak terhingga') {
            currentOperand = '0';
            shouldResetScreen = false;
            isCalculated = false;
            return;
        }

        if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    function calculatePercent() {
        if (currentOperand === '0' || currentOperand === 'Error' || currentOperand === 'Tak terhingga') return;

        const val = parseFloat(currentOperand);
        if (isNaN(val)) return;

        // Jika terdapat operasi sebelumnya (contoh: 200 + 10%), jadikan persentase dari angka pertama
        if (operation !== null && previousOperand) {
            const prevVal = parseFloat(previousOperand);
            if (!isNaN(prevVal)) {
                currentOperand = formatPrecision((prevVal * val) / 100).toString();
                return;
            }
        }

        // Persentase biasa: dibagi 100
        currentOperand = formatPrecision(val / 100).toString();
    }

    function toggleSign() {
        if (currentOperand === '0' || currentOperand === 'Error' || currentOperand === 'Tak terhingga') return;

        if (currentOperand.startsWith('-')) {
            currentOperand = currentOperand.substring(1);
        } else {
            currentOperand = '-' + currentOperand;
        }
    }

    function formatPrecision(num) {
        return parseFloat(Number(num).toPrecision(12)) / 1;
    }

    // ==========================================
    // FORMAT TAMPILAN ANGKA
    // ==========================================
    function formatDisplayNumber(numberStr) {
        if (numberStr === 'Tak terhingga' || numberStr === 'Error') return numberStr;
        if (numberStr === null || numberStr === undefined || numberStr === '') return '';

        const stringNumber = numberStr.toString();
        const parts = stringNumber.split('.');
        const integerPartStr = parts[0];
        const decimalDigits = parts[1];

        const isNegative = integerPartStr.startsWith('-');
        const cleanIntegerStr = isNegative ? integerPartStr.slice(1) : integerPartStr;
        const integerDigits = parseFloat(cleanIntegerStr);

        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = isNegative ? '-' : '';
        } else {
            integerDisplay = (isNegative ? '-' : '') + integerDigits.toLocaleString('id-ID', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay},${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    function updateDisplay() {
        currentOperandText.innerText = formatDisplayNumber(currentOperand) || '0';

        if (operation != null && !isCalculated) {
            const parts = previousOperand.split(' ');
            const numPart = formatDisplayNumber(parts[0]);
            previousOperandText.innerText = `${numPart} ${parts[1] || ''}`;
        } else {
            previousOperandText.innerText = previousOperand;
        }

        adjustFontSize();
    }

    function adjustFontSize() {
        const length = currentOperandText.innerText.length;
        if (length > 13) {
            currentOperandText.style.fontSize = '1.35rem';
        } else if (length > 9) {
            currentOperandText.style.fontSize = '1.75rem';
        } else {
            currentOperandText.style.fontSize = '2.2rem';
        }
    }

    // ==========================================
    // RIWAYAT PERHITUNGAN
    // ==========================================
    function saveHistory(equation, result) {
        const item = {
            equation: equation,
            result: result.toString(),
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        calculationHistory.unshift(item);
        if (calculationHistory.length > 20) {
            calculationHistory.pop();
        }

        localStorage.setItem('calc_history', JSON.stringify(calculationHistory));
        renderHistory();
    }

    function renderHistory() {
        if (calculationHistory.length === 0) {
            historyList.innerHTML = '<p class="empty-history">Belum ada riwayat perhitungan.</p>';
            return;
        }

        historyList.innerHTML = '';
        calculationHistory.forEach((item) => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');

            const formattedRes = formatDisplayNumber(item.result);

            historyItem.innerHTML = `
                <div class="history-item-exp">${item.equation} =</div>
                <div class="history-item-res">${formattedRes}</div>
            `;

            historyItem.addEventListener('click', () => {
                currentOperand = item.result;
                previousOperand = `${item.equation} =`;
                operation = null;
                shouldResetScreen = true;
                isCalculated = true;
                updateDisplay();
                historyPanel.classList.remove('active');
            });

            historyList.appendChild(historyItem);
        });
    }

    // ==========================================
    // TEMA (DARK / LIGHT)
    // ==========================================
    function initTheme() {
        const savedTheme = localStorage.getItem('calc_theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            updateThemeIcon('light');
        } else {
            document.documentElement.removeAttribute('data-theme');
            updateThemeIcon('dark');
        }
    }

    function toggleTheme() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('calc_theme', 'dark');
            updateThemeIcon('dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('calc_theme', 'light');
            updateThemeIcon('light');
        }
    }

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            themeToggleBtn.title = 'Ganti ke Mode Gelap';
        } else {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            themeToggleBtn.title = 'Ganti ke Mode Terang';
        }
    }

    // ==========================================
    // INPUT KEYBOARD
    // ==========================================
    window.addEventListener('keydown', (e) => {
        let key = e.key;
        let targetButton = null;

        if ((key >= '0' && key <= '9') || key === '.') {
            appendNumber(key);
            updateDisplay();
            targetButton = document.querySelector(`[data-number="${key}"]`);
        } else if (key === '+' || key === '-') {
            const op = key === '-' ? '−' : '+';
            chooseOperation(op);
            updateDisplay();
            targetButton = document.querySelector(`[data-operator="${op}"]`) || document.querySelector(`[data-operator="${key}"]`);
        } else if (key === '*') {
            chooseOperation('×');
            updateDisplay();
            targetButton = document.querySelector(`[data-operator="×"]`);
        } else if (key === '/') {
            e.preventDefault();
            chooseOperation('÷');
            updateDisplay();
            targetButton = document.querySelector(`[data-operator="÷"]`);
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            compute(true);
            targetButton = document.querySelector(`[data-action="calculate"]`);
        } else if (key === 'Backspace') {
            deleteLastChar();
            updateDisplay();
            targetButton = document.querySelector(`[data-action="delete"]`);
        } else if (key === 'Escape') {
            clearAll();
            updateDisplay();
            targetButton = document.querySelector(`[data-action="clear"]`);
        } else if (key === '%') {
            calculatePercent();
            updateDisplay();
            targetButton = document.querySelector(`[data-action="percent"]`);
        } else if (key.toLowerCase() === 'h') {
            historyPanel.classList.toggle('active');
            targetButton = historyToggleBtn;
        }

        if (targetButton) {
            targetButton.classList.add('keyboard-active');
            setTimeout(() => {
                targetButton.classList.remove('keyboard-active');
            }, 120);
        }
    });
});
