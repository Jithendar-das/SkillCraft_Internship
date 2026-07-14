import React, { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import { calculateWinner, isBoardFull, getComputerMove } from "./gameLogic";
import "./TicTacToe.css";

const EMPTY_BOARD = Array(9).fill(null);

export default function Game() {
  const [mode, setMode] = useState("computer"); // "computer" | "human"
  const [squares, setSquares] = useState(EMPTY_BOARD);
  const [xIsNext, setXIsNext] = useState(true);

  const result = calculateWinner(squares);
  const winner = result?.winner ?? null;
  const winningLine = result?.line ?? [];
  const isDraw = !winner && isBoardFull(squares);
  const gameOver = !!winner || isDraw;

  const humanMark = "X";
  const computerMark = "O";
  const isComputerTurn = mode === "computer" && !xIsNext && !gameOver;

  const resetGame = useCallback(() => {
    setSquares(EMPTY_BOARD);
    setXIsNext(true);
  }, []);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetGame();
  };

  const handleSquareClick = (index) => {
    if (gameOver || squares[index] || isComputerTurn) return;
    const next = squares.slice();
    next[index] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // Computer's turn — small delay so its move feels natural rather than instant
  useEffect(() => {
    if (!isComputerTurn) return;
    const timer = setTimeout(() => {
      const move = getComputerMove(squares, computerMark, humanMark);
      if (move === null) return;
      const next = squares.slice();
      next[move] = computerMark;
      setSquares(next);
      setXIsNext(true);
    }, 450);
    return () => clearTimeout(timer);
  }, [isComputerTurn, squares]);

  let status;
  if (winner) {
    status =
      mode === "computer"
        ? winner === humanMark
          ? "You win! 🎉"
          : "Computer wins."
        : `Player ${winner} wins! 🎉`;
  } else if (isDraw) {
    status = "It's a draw.";
  } else if (mode === "computer") {
    status = xIsNext ? "Your turn (X)" : "Computer thinking...";
  } else {
    status = `Player ${xIsNext ? "X" : "O"}'s turn`;
  }

  return (
    <div className="game">
      <h1 className="game__title">Tic-Tac-Toe</h1>

      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === "computer" ? "mode-btn--active" : ""}`}
          onClick={() => handleModeChange("computer")}
        >
          Vs Computer
        </button>
        <button
          className={`mode-btn ${mode === "human" ? "mode-btn--active" : ""}`}
          onClick={() => handleModeChange("human")}
        >
          Vs Player
        </button>
      </div>

      <p className={`status ${winner ? "status--winner" : ""} ${isDraw ? "status--draw" : ""}`}>
        {status}
      </p>

      <Board
        squares={squares}
        onSquareClick={handleSquareClick}
        winningLine={winningLine}
        disabled={gameOver || isComputerTurn}
      />

      <button className="reset-btn" onClick={resetGame}>
        Restart Game
      </button>
    </div>
  );
}
