import { EmptySquare, VirtualSquare } from "./SquareData";

const ROW_COUNT = 19;
const COLUMN_COUNT = 19;

const INITIAL_SQAURES = Array(ROW_COUNT * COLUMN_COUNT)
    .fill(null)
    .map(() => new EmptySquare());

const INDEX_CALCULATORS = [
    (current, n) => current + n, // row
    (current, n) => current + n * COLUMN_COUNT, // column
    (current, n) => current + n * (COLUMN_COUNT + 1), // diagonal 1
    (current, n) => current + n * (COLUMN_COUNT - 1) // diagonal 2
];

function getNthInLine(squares, currentIndex, n, indexCalculate) {
    const [row, column] = getCoordinate(indexCalculate(currentIndex, n));
    return isOutOfBoard(row, column)
        ? new VirtualSquare() // virtual
        : squares[indexCalculate(currentIndex, n)];
}

function getCoordinate(index) {
    return [Math.floor(index / COLUMN_COUNT), index % COLUMN_COUNT];
}

function isOutOfBoard(row, column) {
    return row < 0 || row >= ROW_COUNT || column < 0 || column >= COLUMN_COUNT;
}

function playerMarkersMatchPattern(indexPattern, getNth) {
    const first = getNth(indexPattern[0]);
    for (let i = 1; i < indexPattern.length; i++) {
        if (!playerSquareAndEquals(first, getNth(indexPattern[i]))) return false;
    }
    return true;
}

function playerSquareAndEquals(square1, square2) {
    return square1.isMarkedByPlayer() && square2.isMarkedByPlayer() && square1.isBlack() === square2.isBlack();
}

function clearWarnings(squares) {
    for (let i = 0; i < ROW_COUNT; i++) {
        for (let j = 0; j < COLUMN_COUNT; j++) {
            if (!squares[getIndex(i, j)].setShowWarning) {
                console.log([i, j], squares[getIndex(i, j)]);
            }
            squares[getIndex(i, j)].setShowWarning(false);
        }
    }
}

function getIndex(row, column) {
    return row * COLUMN_COUNT + column;
}

const Gobang = {
    ROW_COUNT,
    COLUMN_COUNT,
    INITIAL_SQAURES,
    INDEX_CALCULATORS,

    playerMarkersMatchPattern,
    getNthInLine,
    clearWarnings
};

export default Gobang;
