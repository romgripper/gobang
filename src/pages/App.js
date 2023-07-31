import { useState } from "react";

const ROW_COUNT = 19;
const COLUMN_COUNT = 19;

const VIRTUAL_ROW_COUNT = ROW_COUNT + 4;
const VIRTUAL_COLUMN_COUNT = COLUMN_COUNT + 4;

const HISTORY_COUNT = 9;

const SQUARE_TYPE_PLAYER = "PLAYER";
const SQUARE_TYPE_EMPTY = "EMPTY";

const WARNING_PATTERNS = [
    // 3 in line
    // OXXXO
    {
        playerIndexes: [0, 1, 2],
        emptyIndexes: [-1, 3]
    },
    {
        playerIndexes: [-1, 0, 1],
        emptyIndexes: [-2, 2]
    },
    {
        playerIndexes: [-2, -1, 0],
        emptyIndexes: [-3, 1]
    },
    // OXOXXO
    {
        playerIndexes: [0, 2, 3],
        emptyIndexes: [-1, 1, 4]
    },
    {
        playerIndexes: [-2, 0, 1],
        emptyIndexes: [-3, -1, 2]
    },
    {
        playerIndexes: [-3, -1, 0],
        emptyIndexes: [-4, -2, 1]
    },
    // OXXOXO
    {
        playerIndexes: [0, 1, 3],
        emptyIndexes: [-1, 2, 4]
    },
    {
        playerIndexes: [-1, 0, 2],
        emptyIndexes: [-2, 1, 3]
    },
    {
        playerIndexes: [-3, -2, 0],
        emptyIndexes: [-4, -1, 1]
    },

    // 4 in line
    // OXXXX
    {
        playerIndexes: [0, 1, 2, 3],
        emptyIndexes: [-1]
    },
    {
        playerIndexes: [-1, 0, 1, 2],
        emptyIndexes: [-2]
    },
    {
        playerIndexes: [-2, -1, 0, 1],
        emptyIndexes: [-3]
    },
    {
        playerIndexes: [-3, -2, -1, 0],
        emptyIndexes: [-4]
    },
    // XOXXX
    {
        playerIndexes: [0, 2, 3, 4],
        emptyIndexes: [1]
    },
    {
        playerIndexes: [-2, 0, 1, 2],
        emptyIndexes: [-1],
        warningIndexes: [-1]
    },
    {
        playerIndexes: [-3, -1, 0, 1],
        emptyIndexes: [-2]
    },
    {
        playerIndexes: [-4, -2, -1, 0],
        emptyIndexes: [-3]
    },
    // XXOXX
    {
        playerIndexes: [0, 1, 3, 4],
        emptyIndexes: [2]
    },
    {
        playerIndexes: [-1, 0, 2, 3],
        emptyIndexes: [1],
        warningIndexes: [1]
    },
    {
        playerIndexes: [-3, -2, 0, 1],
        emptyIndexes: [-1]
    },
    {
        playerIndexes: [-4, -3, -1, 0],
        emptyIndexes: [-2]
    },
    // XXXOX
    {
        playerIndexes: [0, 1, 2, 4],
        emptyIndexes: [3]
    },
    {
        playerIndexes: [-1, 0, 1, 3],
        emptyIndexes: [2],
        warningIndexes: [2]
    },
    {
        playerIndexes: [-2, -1, 0, 2],
        emptyIndexes: [1]
    },
    {
        playerIndexes: [-4, -3, -2, 0],
        emptyIndexes: [-1]
    },
    // XXXXO
    {
        playerIndexes: [0, 1, 2, 3],
        emptyIndexes: [4]
    },
    {
        playerIndexes: [-1, 0, 1, 2],
        emptyIndexes: [3]
    },
    {
        playerIndexes: [-2, -1, 0, 1],
        emptyIndexes: [2]
    },
    {
        playerIndexes: [-3, -2, -1, 0],
        emptyIndexes: [1]
    }
];

class PlayerSquareData {
    constructor(isBlack) {
        this.type = SQUARE_TYPE_PLAYER;
        this.isBlack = isBlack; // black or white
        this.isIn5 = false;
        this.isCurrentMove = false;
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

// is a shown empty square (not virtual or out of board)
function isEmptyAndNotVirtual(squareData) {
    return squareData.type === SQUARE_TYPE_EMPTY && !squareData.isVirtual;
}

function isWarning(squareData) {
    return isEmptyAndNotVirtual(squareData) && squareData.showWarning;
}

function isSquareMarkedByPlayer(squareData) {
    return squareData.type === SQUARE_TYPE_PLAYER;
}

function isIn5(squareData) {
    return isSquareMarkedByPlayer(squareData) && squareData.isIn5;
}

function isCurrentMove(squareData) {
    return isSquareMarkedByPlayer(squareData) && squareData.isCurrentMove;
}

function Square({ squareData, onSquareClick }) {
    let className = "square";
    const value = isSquareMarkedByPlayer(squareData) ? getPlayer(squareData.isBlack) : "";
    if (isWarning(squareData)) {
        className = "warning";
    } else if (isIn5(squareData)) {
        className = "win";
    } else if (isCurrentMove(squareData)) {
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

function checkAndShowWarningsInLine(squares, currentIndex, indexCalculate, patterns) {
    function getNthInLine(n) {
        const [row, column] = getCoordinate(indexCalculate(currentIndex, n));
        return isOutOfBoard(row, column)
            ? new EmptySquareData(true) // virtual
            : squares[indexCalculate(currentIndex, n)];
    }

    function playerMarkersMatchPattern(playerIndexPattern) {
        const first = getNthInLine(playerIndexPattern[0]);
        for (let i = 1; i < playerIndexPattern.length; i++) {
            if (!playerSquareAndEquals(first, getNthInLine(playerIndexPattern[i]))) return false;
        }
        return true;
    }

    function emptySquaresMatchPattern(emptyIndexPattern) {
        for (let i = 0; i < emptyIndexPattern.length; i++) {
            if (!isEmptyAndNotVirtual(getNthInLine(emptyIndexPattern[i]))) return false;
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
            markWarningsInLine(patterns[i].emptyIndexes);
        }
    }
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

function markWarnings(squares, currentMove) {
    clearWarnings(squares);

    [
        (current, n) => current + n,
        (current, n) => current + VIRTUAL_COLUMN_COUNT * n,
        (current, n) => current + n * (VIRTUAL_COLUMN_COUNT + 1),
        (current, n) => current + n * (VIRTUAL_COLUMN_COUNT - 1)
    ].forEach((indexCalculator) => checkAndShowWarningsInLine(squares, currentMove, indexCalculator, WARNING_PATTERNS));
}

export default function Board() {
    const [isNextBlack, setNextBlack] = useState(true);
    const [squares, setSquares] = useState(INITIAL_SQAURES);
    const [currentMove, setCurrentMove] = useState(null);
    const [winner, setWinner] = useState(null);
    const [history, setHistory] = useState([]);

    function takeTurn() {
        setNextBlack(!isNextBlack);
    }

    function handleClick(currentIndex) {
        if (winner || isSquareMarkedByPlayer(squares[currentIndex])) {
            return;
        }
        const currentSquares = squares.slice();
        currentSquares[currentIndex] = new PlayerSquareData(isNextBlack);
        currentSquares[currentIndex].isCurrentMove = true;
        const lastMove = currentMove;
        if (lastMove) {
            currentSquares[lastMove].isCurrentMove = false;
        }
        markWarnings(currentSquares, currentIndex);
        setSquares(currentSquares);
        setCurrentMove(currentIndex);
        history.unshift([squares, currentMove]);
        if (history.length > HISTORY_COUNT) {
            history.pop();
        }
        setHistory(history);
        takeTurn();
        setWinner(calculateWinner(currentSquares));
    }

    function rollbackStep() {
        if (history.length > 0) {
            const [lastSquares, lastMove] = history.shift();
            if (lastMove) {
                lastSquares[lastMove].isCurrentMove = true;
            }
            lastSquares[currentMove].isCurrentMove = false;
            markWarnings(lastSquares, lastMove);
            setCurrentMove(lastMove);
            setSquares(lastSquares);
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
