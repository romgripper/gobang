import { EmptySquare } from "./SquareData";

function createInitialSquares(rowCount, columnCount) {
    return Array(rowCount)
        .fill(null)
        .map(() =>
            Array(columnCount)
                .fill(null)
                .map(() => new EmptySquare())
        );
}

export function getSquare(squares, [row, column]) {
    return squares[row][column];
}

export function getRow(squares, row) {
    return squares[row];
}

export function setSquare(squares, [row, column], square) {
    squares[row][column] = square;
}

const Utils = {
    getSquare,
    setSquare,
    getRow,
    createInitialSquares
};

export default Utils;
