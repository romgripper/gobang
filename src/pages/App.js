import { useState } from "react";

const ROW_COUNT = 19;
const COLUMN_COUNT = 19;

const VIRTUAL_ROW_COUNT = ROW_COUNT + 4;
const VIRTUAL_COLUMN_COUNT = COLUMN_COUNT + 4;

const HISTORY_COUNT = 9;

const SQUARE_TYPE_PLAYER = "PLAYER";
const SQUARE_TYPE_EMPTY = "EMPTY";

class PlayerSquareData {
    constructor(isBlack) {
        this.type = SQUARE_TYPE_PLAYER;
        this.isBlack = isBlack; // black or white
        this.isIn5 = false;
        this.isLastMove = false;
    }
}

class EmptySquareData {
    constructor(isVirtual) {
        this.type = SQUARE_TYPE_EMPTY;
        this.isVirtual = isVirtual;
        this.showWarning = false;
    }
}

function getPlayer(isBlack) {
    return isBlack ? "X" : "O";
}

function getIndex(row, col) {
    return row * VIRTUAL_COLUMN_COUNT + col;
}

function getCoordinate(index) {
    return [Math.floor(index / VIRTUAL_COLUMN_COUNT), index % VIRTUAL_COLUMN_COUNT];
}

let INITIAL_SQAURES = Array(VIRTUAL_ROW_COUNT * VIRTUAL_COLUMN_COUNT);
for (let i = 0; i < VIRTUAL_ROW_COUNT; i++) {
    for (let j = 0; j < VIRTUAL_COLUMN_COUNT; j++) {
        INITIAL_SQAURES[getIndex(i, j)] = new EmptySquareData(isOutOfBoard(i, j));
    }
}

function isOutOfBoard(row, column) {
    return row < 0 || row >= ROW_COUNT || column < 0 || column >= COLUMN_COUNT;
}

function isEmpty(squareData) {
    return squareData.type === SQUARE_TYPE_EMPTY;
}

function isWarning(squareData) {
    return isEmpty(squareData) && squareData.showWarning;
}

function isSquareMarkedByPlayer(squareData) {
    return squareData.type === SQUARE_TYPE_PLAYER;
}

function isIn5(squareData) {
    return isSquareMarkedByPlayer(squareData) && squareData.isIn5;
}

function isLastMove(squareData) {
    return isSquareMarkedByPlayer(squareData) && squareData.isLastMove;
}

function Square({ squareData, onSquareClick }) {
    let className = "square";
    const value = isSquareMarkedByPlayer(squareData) ? getPlayer(squareData.isBlack) : "";
    if (isWarning(squareData)) {
        className = "warning";
    } else if (isIn5(squareData)) {
        className = "win";
    } else if (isLastMove(squareData)) {
        className = "last-move";
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
                squareData={squares[squareIndex]}
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

function check5Inline(squares, currentIndex, indexCalculate) {
    function getNthInLine(n) {
        return squares[indexCalculate(currentIndex, n)];
    }

    const first = getNthInLine(0);
    if (
        playerSquareAndEquals(first, getNthInLine(1)) &&
        playerSquareAndEquals(first, getNthInLine(2)) &&
        playerSquareAndEquals(first, getNthInLine(3)) &&
        playerSquareAndEquals(first, getNthInLine(4))
    ) {
        getNthInLine(0).isIn5 = true;
        getNthInLine(1).isIn5 = true;
        getNthInLine(2).isIn5 = true;
        getNthInLine(3).isIn5 = true;
        getNthInLine(4).isIn5 = true;
        return first;
    }
    return null;
}

function playerSquareAndEquals(squareData1, squareData2) {
    return (
        isSquareMarkedByPlayer(squareData1) &&
        isSquareMarkedByPlayer(squareData2) &&
        squareData1.isBlack === squareData2.isBlack
    );
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

    function playerMarkersMatchPattern(playerIndexPattern) {
        const first = getNthInLine(playerIndexPattern[0]);
        if (!isSquareMarkedByPlayer(first)) return false;
        for (let i = 1; i < playerIndexPattern.length; i++) {
            if (!playerSquareAndEquals(first, getNthInLine(playerIndexPattern[i]))) return false;
        }
        return true;
    }

    function emptySquaresMatchPattern(emptyIndexPattern) {
        for (let i = 0; i < emptyIndexPattern.length; i++) {
            if (!isEmpty(getNthInLine(emptyIndexPattern[i]))) return false;
        }
        return true;
    }

    function markWarningsInLine(warningIndexPattern) {
        for (let i = 0; i < warningIndexPattern.length; i++) {
            getNthInLine(warningIndexPattern[i]).showWarning = true;
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
            if (isWarning(squares[current])) {
                squares[current].showWarning = false;
            }
        }
    }
}

function markWarnings(squares, lastMove) {
    clearWarnings(squares);
    const [row, column] = getCoordinate(lastMove);
    for (let i = row - 5; i <= row + 5; i++) {
        for (let j = column - 5; j <= column + 5; j++) {
            if (isOutOfBoard(i, j)) continue;
            let current = getIndex(i, j);
            mark3InLineWarningsSubScope(squares, current);
            mark4InLineWarningsSubScope(squares, current);
        }
    }
}

export default function Board() {
    const [isNextBlack, setNextBlack] = useState(true);
    const [squares, setSquares] = useState(INITIAL_SQAURES);
    const [lastMove, setLastMove] = useState(null);
    const [winner, setWinner] = useState(null);
    const [history, setHistory] = useState([]);

    function takeTurn() {
        setNextBlack(!isNextBlack);
    }

    function handleClick(i) {
        if (winner || isSquareMarkedByPlayer(squares[i])) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = new PlayerSquareData(isNextBlack);
        nextSquares[i].isLastMove = true;
        if (lastMove) {
            nextSquares[lastMove].isLastMove = false;
        }
        markWarnings(nextSquares, lastMove);
        setSquares(nextSquares);
        setLastMove(i);
        history.unshift([squares, lastMove]);
        if (history.length > HISTORY_COUNT) {
            history.pop();
        }
        setHistory(history);
        takeTurn();
        setWinner(calculateWinner(nextSquares));
    }

    function rollbackStep() {
        if (history.length > 0) {
            const [nextSquares, lastMove] = history.shift();
            markWarnings(nextSquares, lastMove);
            setLastMove(lastMove);
            setSquares(nextSquares);
            setHistory(history);
            takeTurn();
        }
    }

    return (
        <>
            <div className="status">
                {(winner ? "Winner: " + getPlayer(winner.isBlack) : "Next player: " + getPlayer(isNextBlack)) +
                    "; History: " +
                    history.length}
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
