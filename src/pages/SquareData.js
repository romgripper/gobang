const SQUARE_TYPE_PLAYER = "PLAYER";
const SQUARE_TYPE_EMPTY = "EMPTY";

export class PlayerSquareData {
    constructor(isBlack) {
        this.type = SQUARE_TYPE_PLAYER;
        this.isBlack = isBlack; // black or white
        this.isIn5 = false;
        this.isCurrentMove = false;
    }
}

export class EmptySquareData {
    constructor(isVirtual) {
        this.type = SQUARE_TYPE_EMPTY;
        this.isVirtual = isVirtual;
        this.showWarning = false;
    }
}

// is a shown empty square (not virtual or out of board)
export function isEmptyAndNotVirtual(squareData) {
    return squareData.type === SQUARE_TYPE_EMPTY && !squareData.isVirtual;
}

export function isWarning(squareData) {
    return isEmptyAndNotVirtual(squareData) && squareData.showWarning;
}

export function isSquareMarkedByPlayer(squareData) {
    return squareData.type === SQUARE_TYPE_PLAYER;
}

export function getPlayer(isBlack) {
    return isBlack ? "X" : "O";
}
