// ==================== BASIC CALCULATOR ====================
class Calculator {
    constructor() {
        this.currOperand = '';
        this.prevOperand = '';
        this.currentOp = undefined;
        this.history = [];
    }

    updateDisplay() {
        document.getElementById('currOperand').innerText = this.currOperand || '0';
        if (this.currentOp) {
            document.getElementById('prevOperand').innerText = `${this.prevOperand} ${this.currentOp}`;
        } else {
            document.getElementById('prevOperand').innerText = '';
        }
    }

    clear() {
        this.currOperand = '';
        this.prevOperand = '';
        this.currentOp = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currOperand = this.currOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    number(num) {
        if (num === '.' && this.currOperand.includes('.')) return;
        this.currOperand += num;
        this.updateDisplay();
    }

    operation(op) {
        if (this.currOperand === '') return;
        if (this.prevOperand !== '') {
            this.compute();
        }
        this.currentOp = op;
        this.prevOperand = this.currOperand;
        this.currOperand = '';
        this.updateDisplay();
    }

    compute() {
        let result;
        const prev = parseFloat(this.prevOperand);
        const curr = parseFloat(this.currOperand);

        if (isNaN(prev) || isNaN(curr)) return;

        switch (this.currentOp) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '×': result = prev * curr; break;
            case '÷':
                if (curr === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    return;
                }
                result = prev / curr;
                break;
            default: return;
        }

        const entry = `${prev} ${this.currentOp} ${curr} = ${result}`;
        this.addHistory(entry);
        
        this.currOperand = result;
        this.currentOp = undefined;
        this.prevOperand = '';
        this.updateDisplay();
    }

    addHistory(entry) {
        this.history.unshift(entry);
        if (this.history.length > 10) this.history.pop();
        updateBasicHistory();
    }
}

const calc = new Calculator();

function updateBasicHistory() {
    const historyDiv = document.getElementById('basicHistory');
    historyDiv.innerHTML = '';
    calc.history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerText = item;
        div.onclick = () => {
            calc.currOperand = item.split('=')[1].trim();
            calc.updateDisplay();
        };
        historyDiv.appendChild(div);
    });
}

// ==================== TAB SWITCHING ====================
function switchTab(tabName, event) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    // Remove active from all tabs
    document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
    
    // Show selected section
    const section = document.getElementById(tabName + 'Tab');
    if (section) section.classList.add('active');
    
    // Mark tab as active
    event.target.classList.add('active');
}

// ==================== TRIGONOMETRIC ====================
function calcTrig(func) {
    const angle = parseFloat(document.getElementById('trigAngle').value);
    if (isNaN(angle)) {
        alert('Please enter a valid angle');
        return;
    }

    let result;
    const rad = angle * Math.PI / 180;

    try {
        switch (func) {
            case 'sin': result = Math.sin(rad); break;
            case 'cos': result = Math.cos(rad); break;
            case 'tan': result = Math.tan(rad); break;
            case 'cot': result = 1 / Math.tan(rad); break;
            case 'sec': result = 1 / Math.cos(rad); break;
            case 'csc': result = 1 / Math.sin(rad); break;
            case 'sinh': result = Math.sinh(angle); break;
            case 'cosh': result = Math.cosh(angle); break;
            case 'tanh': result = Math.tanh(angle); break;
            case 'asin':
                if (angle < -1 || angle > 1) throw new Error('asin input must be between -1 and 1');
                result = Math.asin(angle) * 180 / Math.PI;
                break;
            case 'acos':
                if (angle < -1 || angle > 1) throw new Error('acos input must be between -1 and 1');
                result = Math.acos(angle) * 180 / Math.PI;
                break;
            case 'atan': result = Math.atan(angle) * 180 / Math.PI; break;
            default: return;
        }

        document.getElementById('trigResult').innerText = `${func}(${angle}°) = ${result.toFixed(6)}`;
        calc.currOperand = result;
        calc.updateDisplay();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ==================== MATRIX OPERATIONS ====================
let matrixData = [];

function renderMatrixInputs() {
    const size = parseInt(document.getElementById('matrixSize').value);
    const area = document.getElementById('matrixInputArea');
    area.innerHTML = '';
    matrixData = [];

    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-input';
            input.placeholder = `[${i + 1},${j + 1}]`;
            input.value = '0';
            input.id = `m_${i}_${j}`;
            area.appendChild(input);
            row.push(input);
        }
        if (i < size - 1) area.appendChild(document.createElement('br'));
        matrixData.push(row);
    }
}

function getMatrixValues() {
    const size = parseInt(document.getElementById('matrixSize').value);
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const val = parseFloat(document.getElementById(`m_${i}_${j}`).value);
            if (isNaN(val)) {
                alert('Please fill all matrix values');
                return null;
            }
            row.push(val);
        }
        matrix.push(row);
    }
    return matrix;
}

function calcMatrix(operation) {
    const matrix = getMatrixValues();
    if (!matrix) return;

    let result;
    try {
        switch (operation) {
            case 'det':
                result = getDeterminant(matrix);
                document.getElementById('matrixResult').innerText = `Determinant = ${result.toFixed(6)}`;
                calc.currOperand = result;
                break;
            case 'trace':
                result = getTrace(matrix);
                document.getElementById('matrixResult').innerText = `Trace = ${result.toFixed(6)}`;
                calc.currOperand = result;
                break;
            case 'transpose':
                result = transpose(matrix);
                document.getElementById('matrixResult').innerText = `Transposed:\n${formatMatrix(result)}`;
                break;
            case 'inverse':
                const det = getDeterminant(matrix);
                if (Math.abs(det) < 0.0001) throw new Error('Matrix is singular');
                result = getInverse(matrix);
                document.getElementById('matrixResult').innerText = `Inverse:\n${formatMatrix(result)}`;
                break;
        }
        calc.updateDisplay();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function getDeterminant(matrix) {
    const n = matrix.length;
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    } else if (n === 3) {
        return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
               matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
               matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
    } else if (n === 4) {
        let det = 0;
        for (let i = 0; i < 4; i++) {
            det += Math.pow(-1, i) * matrix[0][i] * getMinorDet(matrix, 0, i);
        }
        return det;
    }
    return 0;
}

function getMinorDet(matrix, row, col) {
    const minor = [];
    for (let i = 0; i < matrix.length; i++) {
        if (i === row) continue;
        const minorRow = [];
        for (let j = 0; j < matrix[i].length; j++) {
            if (j === col) continue;
            minorRow.push(matrix[i][j]);
        }
        minor.push(minorRow);
    }
    return getDeterminant(minor);
}

function getTrace(matrix) {
    let trace = 0;
    for (let i = 0; i < matrix.length; i++) {
        trace += matrix[i][i];
    }
    return trace;
}

function transpose(matrix) {
    const result = [];
    for (let i = 0; i < matrix[0].length; i++) {
        const row = [];
        for (let j = 0; j < matrix.length; j++) {
            row.push(matrix[j][i]);
        }
        result.push(row);
    }
    return result;
}

function getInverse(matrix) {
    const n = matrix.length;
    const det = getDeterminant(matrix);
    if (n === 2) {
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    } else if (n === 3) {
        const adj = getAdjugate(matrix);
        return adj.map(row => row.map(val => val / det));
    }
    throw new Error('Inverse not supported for 4x4 matrices in this version');
}

function getAdjugate(matrix) {
    const n = matrix.length;
    const adj = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            const minor = [];
            for (let k = 0; k < n; k++) {
                if (k === i) continue;
                const minorRow = [];
                for (let l = 0; l < n; l++) {
                    if (l === j) continue;
                    minorRow.push(matrix[k][l]);
                }
                minor.push(minorRow);
            }
            row.push(Math.pow(-1, i + j) * getDeterminant(minor));
        }
        adj.push(row);
    }
    return transpose(adj);
}

function formatMatrix(matrix) {
    return matrix.map(row => row.map(val => val.toFixed(4)).join('  ')).join('\n');
}

// ==================== STATISTICS ====================
function calcStats(operation) {
    const input = document.getElementById('statsInput').value;
    const numbers = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

    if (numbers.length === 0) {
        alert('Please enter valid numbers');
        return;
    }

    let result;
    try {
        switch (operation) {
            case 'mean':
                result = numbers.reduce((a, b) => a + b, 0) / numbers.length;
                document.getElementById('statsResult').innerText = `Mean: ${result.toFixed(6)}`;
                break;
            case 'median':
                const sorted = [...numbers].sort((a, b) => a - b);
                result = sorted.length % 2 === 0 ?
                    (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 :
                    sorted[Math.floor(sorted.length / 2)];
                document.getElementById('statsResult').innerText = `Median: ${result.toFixed(6)}`;
                break;
            case 'mode':
                const freq = {};
                numbers.forEach(n => freq[n] = (freq[n] || 0) + 1);
                result = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
                document.getElementById('statsResult').innerText = `Mode: ${result}`;
                break;
            case 'sum':
                result = numbers.reduce((a, b) => a + b, 0);
                document.getElementById('statsResult').innerText = `Sum: ${result.toFixed(6)}`;
                break;
            case 'count':
                result = numbers.length;
                document.getElementById('statsResult').innerText = `Count: ${result}`;
                break;
            case 'range':
                result = Math.max(...numbers) - Math.min(...numbers);
                document.getElementById('statsResult').innerText = `Range: ${result.toFixed(6)}`;
                break;
            case 'variance':
                const mean1 = numbers.reduce((a, b) => a + b, 0) / numbers.length;
                result = numbers.reduce((a, b) => a + Math.pow(b - mean1, 2), 0) / numbers.length;
                document.getElementById('statsResult').innerText = `Variance: ${result.toFixed(6)}`;
                break;
            case 'stdev':
                const mean2 = numbers.reduce((a, b) => a + b, 0) / numbers.length;
                const variance = numbers.reduce((a, b) => a + Math.pow(b - mean2, 2), 0) / numbers.length;
                result = Math.sqrt(variance);
                document.getElementById('statsResult').innerText = `Standard Deviation: ${result.toFixed(6)}`;
                break;
        }
        calc.currOperand = result;
        calc.updateDisplay();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ==================== PERMUTATION & COMBINATION ====================
function calcPermComb(operation) {
    const n = parseInt(document.getElementById('permN').value);
    const r = parseInt(document.getElementById('permR').value);

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
        alert('Please enter valid values');
        return;
    }

    try {
        let result;
        if (operation === 'perm') {
            result = factorial(n) / factorial(n - r);
            document.getElementById('permcombResult').innerText = `P(${n},${r}) = ${Math.floor(result)}`;
        } else {
            result = factorial(n) / (factorial(r) * factorial(n - r));
            document.getElementById('permcombResult').innerText = `C(${n},${r}) = ${Math.floor(result)}`;
        }
        calc.currOperand = result;
        calc.updateDisplay();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function factorial(n) {
    if (n < 0) throw new Error('Negative factorial');
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

// ==================== EXTRA FUNCTIONS ====================
function calcExtra(operation) {
    const num = parseFloat(document.getElementById('extraNumber').value);
    if (isNaN(num)) {
        alert('Please enter a valid number');
        return;
    }

    let result;
    try {
        switch (operation) {
            case 'sqrt': result = Math.sqrt(num); break;
            case 'cbrt': result = Math.cbrt(num); break;
            case 'square': result = num * num; break;
            case 'cube': result = num * num * num; break;
            case 'log10': result = Math.log10(num); break;
            case 'ln': result = Math.log(num); break;
            case 'exp': result = Math.exp(num); break;
            case 'abs': result = Math.abs(num); break;
            case 'floor': result = Math.floor(num); break;
            case 'ceil': result = Math.ceil(num); break;
            case 'round': result = Math.round(num); break;
            case 'factorial': result = factorial(Math.floor(num)); break;
            default: return;
        }

        document.getElementById('extraResult').innerText = `${operation}(${num}) = ${result.toFixed(6)}`;
        calc.currOperand = result;
        calc.updateDisplay();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    calc.updateDisplay();
    renderMatrixInputs();
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') calc.compute();
        if (e.key === 'Backspace') calc.delete();
        if (e.key === 'Escape') calc.clear();
        if (e.key === '+') calc.operation('+');
        if (e.key === '-') calc.operation('-');
        if (e.key === '*') calc.operation('×');
        if (e.key === '/') { e.preventDefault(); calc.operation('÷'); }
        if (e.key >= '0' && e.key <= '9') calc.number(e.key);
        if (e.key === '.') calc.number('.');
    });
});
