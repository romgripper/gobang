import { EmptySquare, VirtualSquare } from "./SquareData";

function createInitialSquares(rowCount, columnCount) {
    return Array(rowCount)
        .fill(null)
        .map(() =>
            Array(columnCount)
                .fill(null)
                .map(() => new EmptySquare())
        );
}

function getSquare(squares, [row, column]) {
    return squares[row][column];
}

function getRow(squares, row) {
    return squares[row];
}

function setSquare(squares, [row, column], square) {
    squares[row][column] = square;
}

// Go
const GO_ROW_COUNT = 19;
const GO_COLUMN_COUNT = 19;

// Gobang only
const GOBANG_ROW_COUNT = 15;
const GOBANG_COLUMN_COUNT = 15;

const COORDINATE_CALCULATORS = [
    ([row, column], n) => [row, column + n], // row
    ([row, column], n) => [row + n, column], // column
    ([row, column], n) => [row + n, column + n], // diagonal 1
    ([row, column], n) => [row + n, column - n] // diagonal 2
];

const VIRTUAL_SQUARE = new VirtualSquare();
// return a virtual square if out of board
function getNthSquareInLine(squares, currentCoordinate, n, coordinateCalculator) {
    const coordinate = coordinateCalculator(currentCoordinate, n);
    return isOutOfBoard(coordinate) ? VIRTUAL_SQUARE : getSquare(squares, coordinate);
}

function isOutOfBoard([row, column]) {
    return row < 0 || row >= GOBANG_ROW_COUNT || column < 0 || column >= GOBANG_COLUMN_COUNT;
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

// default export
const Game = {
    go: {
        ROW_COUNT: GO_ROW_COUNT,
        COLUMN_COUNT: GO_COLUMN_COUNT,
        INITIAL_SQUARES: createInitialSquares(GO_ROW_COUNT, GO_COLUMN_COUNT),

        getSquare,
        setSquare,
        getRow
    },
    gobang: {
        ROW_COUNT: GOBANG_ROW_COUNT,
        COLUMN_COUNT: GOBANG_COLUMN_COUNT,
        INITIAL_SQUARES: createInitialSquares(GOBANG_ROW_COUNT, GOBANG_COLUMN_COUNT),
        COORDINATE_CALCULATORS,

        getSquare: getSquare,
        setSquare,
        getRow,
        playerMarkersMatchPattern,
        getNthSquareInLine
    }
};

export default Game;
