import { useState } from "react";

function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Row({ squares, row, rowSize, handleClick }) {
    let columns = [];
    for (let i = 0; i < rowSize; i++) {
        const squareIndex = row * (rowSize + 4) + i;
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

function fiveInRow(squares, currentIndex) {
    console.log("fiveInRow" + currentIndex);
    if (
        squares[currentIndex] &&
        squares[currentIndex] === squares[currentIndex + 1] &&
        squares[currentIndex] === squares[currentIndex + 2] &&
        squares[currentIndex] === squares[currentIndex + 3] &&
        squares[currentIndex] === squares[currentIndex + 4]
    ) {
        console.log("winner");
        return squares[currentIndex];
    }
    return null;
}

function fiveInColumn(squares, currentIndex, colCount) {
    if (
        squares[currentIndex] &&
        squares[currentIndex] === squares[currentIndex + 1 * colCount] &&
        squares[currentIndex] === squares[currentIndex + 2 * colCount] &&
        squares[currentIndex] === squares[currentIndex + 3 * colCount] &&
        squares[currentIndex] === squares[currentIndex + 4 * colCount]
    )
        return squares[currentIndex];
    return null;
}

function fiveInDiagonal(squares, currentIndex, colCount) {
    if (
        squares[currentIndex] &&
        squares[currentIndex] === squares[currentIndex + 1 * colCount + 1] &&
        squares[currentIndex] === squares[currentIndex + 2 * colCount + 2] &&
        squares[currentIndex] === squares[currentIndex + 3 * colCount + 3] &&
        squares[currentIndex] === squares[currentIndex + 4 * colCount + 4]
    ) {
        console.log("fiveInDiagonal" + currentIndex);
        return squares[currentIndex];
    } else if (
        squares[currentIndex + 4] &&
        squares[currentIndex + 4] === squares[currentIndex + 1 * colCount + 3] &&
        squares[currentIndex + 4] === squares[currentIndex + 2 * colCount + 2] &&
        squares[currentIndex + 4] === squares[currentIndex + 3 * colCount + 1] &&
        squares[currentIndex + 4] === squares[currentIndex + 4 * colCount]
    ) {
        console.log("fiveInDiagonal" + currentIndex);
        return squares[currentIndex + 4];
    }
    return null;
}

function calculateWinnerSmallScope(squares, currentIndex, virualColCount) {
    return (
        fiveInRow(squares, currentIndex) ||
        fiveInColumn(squares, currentIndex, virualColCount) ||
        fiveInDiagonal(squares, currentIndex, virualColCount)
    );
}

function calculateWinner(squares, virtualRowCount, virualColCount) {
    for (let i = 0; i < virtualRowCount - 4; i++)
        for (let j = 0; j < virualColCount - 4; j++) {
            const currentIndex = i * virualColCount + j;
            const winner = calculateWinnerSmallScope(squares, currentIndex, virualColCount);
            if (winner) {
                return winner;
            }
        }
    return null;
}

export default function Board() {
    const rowCount = 19;
    const colCount = 19;
    const virtualRowCount = rowCount + 4;
    const virtualColCount = colCount + 4;

    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(virtualRowCount * virtualColCount).fill(null));
    const [winner, setWinner] = useState(null);

    function handleClick(i) {
        if (winner || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
        setWinner(calculateWinner(nextSquares, virtualRowCount, virtualColCount));
    }

    return (
        <>
            <div className="status">{winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O")}</div>
            {range(rowCount).map((row) => (
                <Row squares={squares} row={row} key={"row" + row} rowSize={colCount} handleClick={handleClick} />
            ))}
        </>
    );
}
