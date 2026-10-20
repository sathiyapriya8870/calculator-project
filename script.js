
const screen = document.getElementById("screen");
const previous = document.getElementById("previous");

let currentInput = "0";
let storedValue = null;
let selectedOperator = null;
let waitingForNumber = false;
let justCalculated = false;


// Update calculator display
function updateScreen() {
    screen.value = currentInput;
}


// Enter numbers
function inputNumber(number) {
    if (currentInput === "Error" || justCalculated) {
        currentInput = number;
        justCalculated = false;
        storedValue = null;
        selectedOperator = null;
        previous.textContent = "";
        updateScreen();
        return;
    }

    if (waitingForNumber) {
        currentInput = number;
        waitingForNumber = false;
    } else {
        currentInput =
            currentInput === "0" ? number : currentInput + number;
    }

    updateScreen();
}


// Enter decimal point
function inputDecimal() {
    if (currentInput === "Error" || justCalculated) {
        currentInput = "0.";
        justCalculated = false;
        storedValue = null;
        selectedOperator = null;
        previous.textContent = "";
        updateScreen();
        return;
    }

    if (waitingForNumber) {
        currentInput = "0.";
        waitingForNumber = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateScreen();
}


// Perform arithmetic operation
function performCalculation(first, second, operator) {
    switch (operator) {
        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":
            if (second === 0) {
                return "Error";
            }
            return first / second;

        case "%":
            if (second === 0) {
                return "Error";
            }
            return first % second;

        default:
            return second;
    }
}


// Format calculation result
function formatResult(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(10)));
}


// Choose an operator
function chooseOperator(operator) {
    if (currentInput === "Error") {
        clearScreen();
        return;
    }

    const inputValue = Number(currentInput);

    if (selectedOperator && !waitingForNumber) {
        const result = performCalculation(
            storedValue,
            inputValue,
            selectedOperator
        );

        if (result === "Error" || !Number.isFinite(result)) {
            currentInput = "Error";
            storedValue = null;
            selectedOperator = null;
            previous.textContent = "";
            updateScreen();
            waitingForNumber = true;
            return;
        }

        currentInput = formatResult(result);
        storedValue = Number(currentInput);
    } else {
        storedValue = inputValue;
    }

    selectedOperator = operator;
    waitingForNumber = true;
    justCalculated = false;

    previous.textContent = `${currentInput} ${getSymbol(operator)}`;
    updateScreen();
}


// Display correct operator symbol
function getSymbol(operator) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return symbols[operator] || operator;
}


// Calculate final result
function calculate() {
    if (
        selectedOperator === null ||
        storedValue === null ||
        waitingForNumber ||
        currentInput === "Error"
    ) {
        return;
    }

    const first = storedValue;
    const second = Number(currentInput);
    const operator = selectedOperator;

    const result = performCalculation(first, second, operator);

    previous.textContent =
        `${formatResult(first)} ${getSymbol(operator)} ${formatResult(second)} =`;

    if (result === "Error" || !Number.isFinite(result)) {
        currentInput = "Error";
    } else {
        currentInput = formatResult(result);
    }

    storedValue = null;
    selectedOperator = null;
    waitingForNumber = true;
    justCalculated = true;

    updateScreen();
}


// Clear everything
function clearScreen() {
    currentInput = "0";
    storedValue = null;
    selectedOperator = null;
    waitingForNumber = false;
    justCalculated = false;

    previous.textContent = "";

    updateScreen();
}


// Delete last digit
function deleteLast() {
    if (currentInput === "Error" || justCalculated) {
        clearScreen();
        return;
    }

    if (waitingForNumber) {
        return;
    }

    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);

        if (currentInput === "-") {
            currentInput = "0";
        }
    } else {
        currentInput = "0";
    }

    updateScreen();
}


// Change positive number to negative or vice versa
function toggleSign() {
    if (currentInput === "Error") {
        clearScreen();
        return;
    }

    if (currentInput === "0") {
        return;
    }

    currentInput = String(Number(currentInput) * -1);
    justCalculated = false;

    updateScreen();
}


// Keyboard support
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (key >= "0" && key <= "9") {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/", "%"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape" || key === "Delete") {
        clearScreen();
    }
});


// Initial display
updateScreen();

