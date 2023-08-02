import { EmptySquare, VirtualSquare } from "./SquareData";

const ROW_COUNT = 19;
const COLUMN_COUNT = 19;

const INITIAL_SQAURES = Array(ROW_COUNT)
    .fill(null)
    .map(() =>
        Array(COLUMN_COUNT)
            .fill(null)
            .map(() => new EmptySquare())
    );

const COORDINATE_CALCULATORS = [
    ([row, column], n) => [row, column + n], // row
    ([row, column], n) => [row + n, column], // column
    ([row, column], n) => [row + n, column + n], // diagonal 1
    ([row, column], n) => [row + n, column - n] // diagonal 2
];

export function getSquare(squares, [row, column]) {
    return squares[row][column];
}

export function getRow(squares, row) {
    return squares[row];
}

export function setSquare(squares, [row, column], square) {
    squares[row][column] = square;
}

// return a virtual square if out of board
function getNthSquareInLine(squares, currentCoordinate, n, coordinateCalculator) {
    const coordinate = getNthCoordinateInLine(currentCoordinate, n, coordinateCalculator);
    return isOutOfBoard(coordinate)
        ? new VirtualSquare() // virtual
        : getSquare(squares, coordinate);
}

function getNthCoordinateInLine(currentCoordinate, n, coordinateCalculator) {
    return coordinateCalculator(currentCoordinate, n);
}

function isOutOfBoard([row, column]) {
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
            getSquare(squares, [i, j]).setShowWarning(false);
        }
    }
}

const Gobang = {
    ROW_COUNT,
    COLUMN_COUNT,
    INITIAL_SQAURES,
    COORDINATE_CALCULATORS,

    getSquare,
    setSquare,
    getRow,
    playerMarkersMatchPattern,
    getNthSquareInLine,
    getNthCoordinateInLine,
    clearWarnings
};

export default Gobang;
