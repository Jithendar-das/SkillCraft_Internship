import React from "react";

export default function Square({ value, onClick, isWinning, disabled }) {
  return (
    <button
      className={`square ${isWinning ? "square--winning" : ""} ${
        value ? `square--${value.toLowerCase()}` : ""
      }`}
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={value ? `Square filled with ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}
