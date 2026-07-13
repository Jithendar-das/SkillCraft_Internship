import React, { useState, useEffect, useCallback } from "react";


function Display({ expression, current, isError }) {
  return (
    <div className={`display ${isError ? "display--error" : ""}`}>
      <div className="display__expression">{expression}</div>
      <div className="display__current">{current}</div>
    </div>
  );
}

function CalcButton({ label, onClick, variant, span }) {
  return (
    <button
      className={`calc-btn ${variant ? `calc-btn--${variant}` : ""}`}
      style={span ? { gridColumn: `span ${span}` } : undefined}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

const BUTTON_LAYOUT = [
  { label: "C", action: "clear", variant: "clear" },
  { label: "⌫", action: "delete" },
  { label: "%", action: "operator", value: "%", variant: "operator" },
  { label: "÷", action: "operator", value: "/", variant: "operator" },

  { label: "7", action: "number", value: "7" },
  { label: "8", action: "number", value: "8" },
  { label: "9", action: "number", value: "9" },
  { label: "×", action: "operator", value: "*", variant: "operator" },

  { label: "4", action: "number", value: "4" },
  { label: "5", action: "number", value: "5" },
  { label: "6", action: "number", value: "6" },
  { label: "−", action: "operator", value: "-", variant: "operator" },

  { label: "1", action: "number", value: "1" },
  { label: "2", action: "number", value: "2" },
  { label: "3", action: "number", value: "3" },
  { label: "+", action: "operator", value: "+", variant: "operator" },

  { label: "0", action: "number", value: "0", span: 2 },
  { label: ".", action: "decimal" },
  { label: "=", action: "equals", variant: "equals" },
];

export default function Calculator() {
  const [current, setCurrent] = useState("0");
  const [expression, setExpression] = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [isError, setIsError] = useState(false);

  const clearAll = useCallback(() => {
    setCurrent("0");
    setExpression("");
    setJustEvaluated(false);
    setIsError(false);
  }, []);

  const showError = useCallback((message) => {
    setIsError(true);
    setCurrent(message);
    setTimeout(clearAll, 1500);
  }, [clearAll]);

  const deleteLast = useCallback(() => {
    if (justEvaluated) { clearAll(); return; }
    setCurrent((c) => (c.length > 1 ? c.slice(0, -1) : "0"));
  }, [justEvaluated, clearAll]);

  const inputNumber = useCallback((num) => {
    if (justEvaluated) {
      setCurrent(num);
      setExpression("");
      setJustEvaluated(false);
      return;
    }
    setCurrent((c) => (c === "0" ? num : c + num));
  }, [justEvaluated]);

  const inputDecimal = useCallback(() => {
    if (justEvaluated) {
      setCurrent("0.");
      setExpression("");
      setJustEvaluated(false);
      return;
    }
    setCurrent((c) => (c.includes(".") ? c : c + "."));
  }, [justEvaluated]);

  const runOperation = useCallback((a, op, b) => {
    switch (op) {
      case "+": return { ok: true, value: a + b };
      case "-": return { ok: true, value: a - b };
      case "*": return { ok: true, value: a * b };
      case "%": return { ok: true, value: a % b };
      case "/":
        if (b === 0) return { ok: false, message: "Cannot divide by 0" };
        return { ok: true, value: a / b };
      default:
        return { ok: false, message: "Error" };
    }
  }, []);

  const evaluate = useCallback((finalize = true) => {
    if (!expression) return;
    const [aStr, op] = expression.split(" ");
    const a = parseFloat(aStr);
    const b = parseFloat(current);

    if (Number.isNaN(a) || Number.isNaN(b)) {
      showError("Error");
      return;
    }

    const result = runOperation(a, op, b);
    if (!result.ok) {
      showError(result.message);
      return;
    }

    const rounded = Math.round(result.value * 1e10) / 1e10;

    if (finalize) {
      setExpression(`${a} ${op} ${b} =`);
      setCurrent(String(rounded));
      setJustEvaluated(true);
    } else {
      setCurrent(String(rounded));
      setExpression("");
    }
  }, [expression, current, runOperation, showError]);

  const inputOperator = useCallback((op) => {
    if (expression && !justEvaluated) {
      evaluate(false);
    }
    setJustEvaluated(false);
    setExpression(`${current} ${op}`);
    setCurrent("0");
  }, [expression, justEvaluated, current, evaluate]);

  const handleAction = useCallback((btn) => {
    switch (btn.action) {
      case "number": inputNumber(btn.value); break;
      case "decimal": inputDecimal(); break;
      case "operator": inputOperator(btn.value); break;
      case "equals": evaluate(true); break;
      case "clear": clearAll(); break;
      case "delete": deleteLast(); break;
      default: break;
    }
  }, [inputNumber, inputDecimal, inputOperator, evaluate, clearAll, deleteLast]);

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") { inputNumber(e.key); return; }
      if (e.key === ".") { inputDecimal(); return; }
      if (["+", "-", "*", "/", "%"].includes(e.key)) { inputOperator(e.key); return; }
      if (e.key === "Enter" || e.key === "=") { e.preventDefault(); evaluate(true); return; }
      if (e.key === "Backspace") { deleteLast(); return; }
      if (e.key === "Escape") { clearAll(); return; }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [inputNumber, inputDecimal, inputOperator, evaluate, deleteLast, clearAll]);

  return (
    <div className="calc-page">
      <style>{`
        .calc-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f1f5f9;
          font-family: Arial, Helvetica, sans-serif;
        }
        .calculator {
          width: 320px;
          background: #222;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
        .display {
          background: #111;
          color: #fff;
          border-radius: 8px;
          padding: 20px 16px;
          margin-bottom: 16px;
          text-align: right;
          overflow-wrap: break-word;
        }
        .display__expression {
          font-size: 14px;
          color: #999;
          min-height: 18px;
        }
        .display__current {
          font-size: 32px;
          min-height: 40px;
          overflow-x: auto;
        }
        .display--error .display__current {
          color: #f87171;
          font-size: 20px;
        }
        .buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .calc-btn {
          border: none;
          border-radius: 8px;
          padding: 18px 0;
          font-size: 18px;
          cursor: pointer;
          background: #3a3a3a;
          color: #fff;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .calc-btn:hover { background: #4a4a4a; }
        .calc-btn:active { transform: scale(0.96); }
        .calc-btn--operator { background: #f59e0b; }
        .calc-btn--operator:hover { background: #fbbf24; }
        .calc-btn--equals { background: #3b82f6; grid-column: span 2; }
        .calc-btn--equals:hover { background: #60a5fa; }
        .calc-btn--clear { background: #ef4444; }
        .calc-btn--clear:hover { background: #f87171; }
      `}</style>

      <div className="calculator">
        <Display expression={expression} current={current} isError={isError} />
        <div className="buttons">
          {BUTTON_LAYOUT.map((btn, i) => (
            <CalcButton
              key={i}
              label={btn.label}
              variant={btn.variant}
              span={btn.span}
              onClick={() => handleAction(btn)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
