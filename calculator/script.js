let display = document.getElementById("display");
let historyList = document.getElementById("historyList");

// Basic
function appendValue(val) {
    display.value += val;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Scientific buttons
function sin() { display.value += "sin("; }
function cos() { display.value += "cos("; }
function tan() { display.value += "tan("; }
function log() { display.value += "log("; }
function sqrt() { display.value += "sqrt("; }
function square() { display.value += "^2"; }

// 👉 SAFE & CORRECT CALCULATION ENGINE
function calculate() {
    try {
        let exp = display.value;

        // Auto close brackets
        let open = (exp.match(/\(/g) || []).length;
        let close = (exp.match(/\)/g) || []).length;
        while (open > close) {
            exp += ")";
            close++;
        }

        // Convert functions properly (DEGREE MODE)
        exp = exp.replace(/sin\(([^)]+)\)/g, (_, val) => {
            return Math.sin((parseFloat(val) * Math.PI) / 180);
        });

        exp = exp.replace(/cos\(([^)]+)\)/g, (_, val) => {
            return Math.cos((parseFloat(val) * Math.PI) / 180);
        });

        exp = exp.replace(/tan\(([^)]+)\)/g, (_, val) => {
            return Math.tan((parseFloat(val) * Math.PI) / 180);
        });

        exp = exp.replace(/log\(([^)]+)\)/g, (_, val) => {
            return Math.log10(parseFloat(val));
        });

        exp = exp.replace(/sqrt\(([^)]+)\)/g, (_, val) => {
            return Math.sqrt(parseFloat(val));
        });

        // Power fix
        exp = exp.replace(/\^/g, "**");

        let result = Function('"use strict";return (' + exp + ')')();

        if (!isFinite(result)) {
            display.value = "Error";
            return;
        }

        addToHistory(display.value + " = " + result);
        display.value = result;

    } catch (e) {
        display.value = "Error";
    }
}

// History
function addToHistory(item) {
    let li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
}

// Theme
function toggleTheme() {
    document.body.classList.toggle("light");
}

// Keyboard
document.addEventListener("keydown", function(e) {
    if (!isNaN(e.key) || "+-*/.%()".includes(e.key)) {
        appendValue(e.key);
    } else if (e.key === "Enter") {
        calculate();
    } else if (e.key === "Backspace") {
        deleteLast();
    }
});