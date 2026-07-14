export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

// Returns { winner: 'X' | 'O', line: [a,b,c] } or null
export function calculateWinner(squares) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export function isBoardFull(squares) {
  return squares.every((sq) => sq !== null);
}

// Minimax search — computer plays optimally (unbeatable)
function minimax(squares, depth, isMaximizing, computerMark, humanMark) {
  const result = calculateWinner(squares);
  if (result) {
    if (result.winner === computerMark) return 10 - depth;
    return depth - 10;
  }
  if (isBoardFull(squares)) return 0;

  const emptyIndices = squares
    .map((val, i) => (val === null ? i : null))
    .filter((i) => i !== null);

  if (isMaximizing) {
    let best = -Infinity;
    for (const i of emptyIndices) {
      const next = squares.slice();
      next[i] = computerMark;
      best = Math.max(best, minimax(next, depth + 1, false, computerMark, humanMark));
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of emptyIndices) {
      const next = squares.slice();
      next[i] = humanMark;
      best = Math.min(best, minimax(next, depth + 1, true, computerMark, humanMark));
    }
    return best;
  }
}

// Picks the best available move for the computer
export function getComputerMove(squares, computerMark, humanMark) {
  let bestScore = -Infinity;
  let bestMove = null;

  const emptyIndices = squares
    .map((val, i) => (val === null ? i : null))
    .filter((i) => i !== null);

  for (const i of emptyIndices) {
    const next = squares.slice();
    next[i] = computerMark;
    const score = minimax(next, 0, false, computerMark, humanMark);
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}
