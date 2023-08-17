import Utils from "./Utils";
import { VirtualSquare } from "./SquareData";

const ROW_COUNT = 15;
const COLUMN_COUNT = 15;

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
    return isOutOfBoard(coordinate) ? VIRTUAL_SQUARE : Utils.getSquare(squares, coordinate);
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

// default export
const GobangUtils = {
    ROW_COUNT,
    COLUMN_COUNT,
    COORDINATE_CALCULATORS,
    getNthSquareInLine,
    playerMarkersMatchPattern
};

export default GobangUtils;
