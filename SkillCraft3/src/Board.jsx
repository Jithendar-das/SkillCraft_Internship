import React from "react";
import Square from "./Square";

export default function Board({ squares, onSquareClick, winningLine, disabled }) {
  return (
    <div className="board">
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          onClick={() => onSquareClick(i)}
          isWinning={winningLine.includes(i)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
