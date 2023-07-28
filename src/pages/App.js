import { useState } from "react";

const rowCount = 19;
const colCount = 19;

const players = ["X", "O"];
//const warning = "W";

function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Row({ squares, row, handleClick }) {
    let columns = [];
    for (let i = 0; i < colCount; i++) {
        const squareIndex = row * colCount + i;
        columns.push(
            <Square
                value={squares[squareIndex]}
                key={"square" + squareIndex}
                onSquareClick={() => handleClick(squareIndex)}
            />
        );
    }
    return <div className="board-row">{columns}</div>;
}

function range(size) {
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(i);
    }
    return a;
}

function fiveInLine(squares, currentIndex, indexCalculate) {
    function getNthInLine(n) {
        return squares[indexCalculate(currentIndex, n)];
    }

    // function setNthInLine(n, value) {
    //     squares[indexCalculate(currentIndex, n)] = value;
    // }
    const first = getNthInLine(0);
    if (
        first &&
        first === getNthInLine(1) &&
        first === getNthInLine(2) &&
        first === getNthInLine(3) &&
        first === getNthInLine(4)
    ) {
        return first;
    }
    return null;
}

function calculateWinnerSubScope(squares, currentIndex) {
    const indexCalculators = [
        (current, n) => current + n,
        (current, n) => current + colCount * n,
        (current, n) => current + n * (colCount + 1),
        (current, n) => current + 4 + n * (colCount - 1)
    ];
    for (let i = 0; i < indexCalculators.length; i++) {
        const winner = fiveInLine(squares, currentIndex, indexCalculators[i]);
        if (winner) return winner;
    }
    return null;
}

function calculateWinner(squares) {
    for (let i = 0; i < rowCount; i++)
        for (let j = 0; j < colCount; j++) {
            const currentIndex = i * colCount + j;
            const winner = calculateWinnerSubScope(squares, currentIndex);
            if (winner) {
                return winner;
            }
        }
    return null;
}

export default function Board() {
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [squares, setSquares] = useState(Array(rowCount * colCount).fill(null));
    const [winner, setWinner] = useState(null);

    function handleClick(i) {
        if (winner || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = players[currentPlayer];
        setSquares(nextSquares);
        setCurrentPlayer((currentPlayer + 1) % 2);
        setWinner(calculateWinner(nextSquares));
    }

    return (
        <>
            <div className="status">
                {winner ? "Winner: " + winner : "Next player: " + players[currentPlayer]}
            </div>
            {range(rowCount).map((row) => (
                <Row squares={squares} row={row} key={"row" + row} rowSize={colCount} handleClick={handleClick} />
            ))}
        </>
    );
}
