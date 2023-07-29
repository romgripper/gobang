import { useState } from "react";

const ROW_COUNT = 19;
const COLUMN_COUNT = 19;

const VIRTUAL_ROW_COUNT = ROW_COUNT + 4;
const VIRTUAL_COLUMN_COUNT = COLUMN_COUNT + 4;

const PLAYERS = ["X", "O"];
const WARNING = "W";
const VIRTUAL = "VIRTUAL";
const WIN = "WIN";

function getIndex(row, col) {
    return row * VIRTUAL_COLUMN_COUNT + col;
}

let INITIAL_SQAURES = Array(VIRTUAL_ROW_COUNT * VIRTUAL_COLUMN_COUNT).fill(VIRTUAL);
for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COLUMN_COUNT; j++) {
        INITIAL_SQAURES[getIndex(i, j)] = null;
    }
}

function Square({ value, onSquareClick }) {
    let className = "square";
    if (value === WARNING) {
        className = "warning";
        value = "";
    } else if (value && value.includes(WIN)) {
        className = "win";
        value = value.charAt(0);
    }

    return (
        <button className={className} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Row({ squares, row, handleClick }) {
    let columns = [];
    for (let i = 0; i < COLUMN_COUNT; i++) {
        const squareIndex = getIndex(row, i);
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

function isSquareMarkedByPlayer(value) {
    return PLAYERS.includes(value);
}

function check5Inline(squares, currentIndex, indexCalculate) {
    function getNthInLine(n) {
        return squares[indexCalculate(currentIndex, n)];
    }

    function setNthInLine(n, value) {
        squares[indexCalculate(currentIndex, n)] = value;
    }

    const first = getNthInLine(0);
    if (
        isSquareMarkedByPlayer(first) &&
        first === getNthInLine(1) &&
        first === getNthInLine(2) &&
        first === getNthInLine(3) &&
        first === getNthInLine(4)
    ) {
        setNthInLine(0, first + WIN);
        setNthInLine(1, first + WIN);
        setNthInLine(2, first + WIN);
        setNthInLine(3, first + WIN);
        setNthInLine(4, first + WIN);
        return first;
    }
    return null;
}

function calculateWinnerSubScope(squares, currentIndex) {
    const indexCalculators = [
        (current, n) => current + n,
        (current, n) => current + VIRTUAL_COLUMN_COUNT * n,
        (current, n) => current + n * (VIRTUAL_COLUMN_COUNT + 1),
        (current, n) => current + 4 + n * (VIRTUAL_COLUMN_COUNT - 1)
    ];
    for (let i = 0; i < indexCalculators.length; i++) {
        const winner = check5Inline(squares, currentIndex, indexCalculators[i]);
        if (winner) return winner;
    }
    return null;
}

function calculateWinner(squares) {
    for (let i = 0; i < ROW_COUNT; i++)
        for (let j = 0; j < COLUMN_COUNT; j++) {
            const currentIndex = getIndex(i, j);
            const winner = calculateWinnerSubScope(squares, currentIndex);
            if (winner) {
                clearWarnings(squares);
                return winner;
            }
        }
    return null;
}

function checkInLine(squares, currentIndex, indexCalculate, patterns) {
    function getNthInLine(n) {
        return squares[indexCalculate(currentIndex, n)];
    }

    function setNthInLine(n, value) {
        squares[indexCalculate(currentIndex, n)] = value;
    }

    function playerMarkersMatchPattern(playerIndexPattern) {
        const firstMarker = getNthInLine(playerIndexPattern[0]);
        if (!isSquareMarkedByPlayer(firstMarker)) return false;
        for (let i = 1; i < playerIndexPattern.length; i++) {
            if (getNthInLine(playerIndexPattern[i]) !== firstMarker) return false;
        }
        return true;
    }

    function emptySquaresMatchPattern(emptyIndexPattern) {
        for (let i = 0; i < emptyIndexPattern.length; i++) {
            if (getNthInLine(emptyIndexPattern[i])) return false;
        }
        return true;
    }

    function markWarningsInLine(warningIndexPattern) {
        for (let i = 0; i < warningIndexPattern.length; i++) {
            setNthInLine(warningIndexPattern[i], WARNING);
        }
    }

    for (let i = 0; i < patterns.length; i++) {
        if (
            playerMarkersMatchPattern(patterns[i].playerIndexes) &&
            emptySquaresMatchPattern(patterns[i].emptyIndexes)
        ) {
            markWarningsInLine(patterns[i].warningIndexes);
            break;
        }
    }
}

const THREE_IN_LINE_PATTERNS = [
    {
        playerIndexes: [1, 3, 4],
        emptyIndexes: [0, 2, 5],
        warningIndexes: [0, 2, 5]
    },
    {
        playerIndexes: [1, 2, 4],
        emptyIndexes: [0, 3, 5],
        warningIndexes: [0, 3, 5]
    },
    {
        playerIndexes: [1, 2, 3],
        emptyIndexes: [0, 4],
        warningIndexes: [0, 4]
    }
];

function check3InLine(squares, currentIndex, indexCalculate) {
    checkInLine(squares, currentIndex, indexCalculate, THREE_IN_LINE_PATTERNS);
}

function mark3InLineWarningsSubScope(squares, currentIndex) {
    const indexCalculators = [
        (current, n) => current + n,
        (current, n) => current + VIRTUAL_COLUMN_COUNT * n,
        (current, n) => current + n * (VIRTUAL_COLUMN_COUNT + 1),
        (current, n) => current + 5 + n * (VIRTUAL_COLUMN_COUNT - 1)
    ];
    for (let i = 0; i < indexCalculators.length; i++) {
        const winner = check3InLine(squares, currentIndex, indexCalculators[i]);
        if (winner) return winner;
    }
    return null;
}

const FOUR_IN_LINE_PATTERNS = [
    {
        playerIndexes: [1, 2, 3, 4],
        emptyIndexes: [0],
        warningIndexes: [0]
    },
    {
        playerIndexes: [0, 2, 3, 4],
        emptyIndexes: [1],
        warningIndexes: [1]
    },
    {
        playerIndexes: [0, 1, 3, 4],
        emptyIndexes: [2],
        warningIndexes: [2]
    },
    {
        playerIndexes: [0, 1, 2, 4],
        emptyIndexes: [3],
        warningIndexes: [3]
    },
    {
        playerIndexes: [0, 1, 2, 3],
        emptyIndexes: [4],
        warningIndexes: [4]
    }
];

function check4InLine(squares, currentIndex, indexCalculate) {
    checkInLine(squares, currentIndex, indexCalculate, FOUR_IN_LINE_PATTERNS);
}

function mark4InLineWarningsSubScope(squares, currentIndex) {
    const indexCalculators = [
        (current, n) => current + n,
        (current, n) => current + VIRTUAL_COLUMN_COUNT * n,
        (current, n) => current + n * (VIRTUAL_COLUMN_COUNT + 1),
        (current, n) => current + 4 + n * (VIRTUAL_COLUMN_COUNT - 1)
    ];
    for (let i = 0; i < indexCalculators.length; i++) {
        const winner = check4InLine(squares, currentIndex, indexCalculators[i]);
        if (winner) return winner;
    }
    return null;
}

function clearWarnings(squares) {
    for (let i = 0; i < ROW_COUNT; i++) {
        for (let j = 0; j < COLUMN_COUNT; j++) {
            let current = getIndex(i, j);
            if (squares[current] === WARNING) {
                squares[current] = null;
            }
        }
    }
}

function markWarnings(squares) {
    clearWarnings(squares);
    for (let i = 0; i < ROW_COUNT; i++) {
        for (let j = 0; j < COLUMN_COUNT; j++) {
            let current = getIndex(i, j);
            mark3InLineWarningsSubScope(squares, current);
            mark4InLineWarningsSubScope(squares, current);
        }
    }
}

export default function Board() {
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [squares, setSquares] = useState(INITIAL_SQAURES);
    const [winner, setWinner] = useState(null);
    const [history, setHistory] = useState(null);

    function handleClick(i) {
        if (winner || isSquareMarkedByPlayer(squares[i])) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = PLAYERS[currentPlayer];
        markWarnings(nextSquares);
        setSquares(nextSquares);
        setHistory(squares);
        setCurrentPlayer((currentPlayer + 1) % 2);
        setWinner(calculateWinner(nextSquares));
    }

    function rollbackStep() {
        if (history) {
            const nextSquares = history;
            markWarnings(nextSquares);
            setSquares(nextSquares);
            setHistory(null);
            setCurrentPlayer((currentPlayer + 1) % 2);
        }
    }

    return (
        <>
            <div className="status">
                {winner ? "Winner: " + winner : "Next player: " + PLAYERS[currentPlayer]}
                <button onClick={rollbackStep} style={{ marginLeft: 20 }}>
                    Back
                </button>
            </div>
            {range(ROW_COUNT).map((row) => (
                <Row squares={squares} row={row} key={"row" + row} rowSize={COLUMN_COUNT} handleClick={handleClick} />
            ))}
        </>
    );
}
