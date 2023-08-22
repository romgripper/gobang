export default class Line {
    static #COORDINATE_CALCULATORS = {
        row: ([row, column], n) => [row, column + n],
        column: ([row, column], n) => [row + n, column],
        forwardDiagonal: ([row, column], n) => [row + n, column - n],
        backwardDiagonal: ([row, column], n) => [row + n, column + n]
    };

    static LINES = Object.keys(Line.#COORDINATE_CALCULATORS);

    #board;
    #startCoordinate; // the coordinate of 0th stone in the line
    #line;

    constructor(board, startCoordinate, line) {
        this.#board = board;
        this.#startCoordinate = startCoordinate;
        this.#line = line;
    }

    // return a virtual stone if out of board
    getNth(n) {
        return this.#board.getStone(this.getNthCoordinate(n));
    }

    getNthCoordinate(n) {
        return Line.#COORDINATE_CALCULATORS[this.#line](this.#startCoordinate, n);
    }

    stonesMatchPattern(pattern) {
        const first = this.getNth(pattern[0]);
        for (let i = 1; i < pattern.length; i++) {
            if (!Line.#isSameStone(first, this.getNth(pattern[i]))) return false;
        }
        return true;
    }

    vacanciesMatchPattern(pattern) {
        for (let i = 0; i < pattern.length; i++) {
            if (!this.getNth(pattern[i]).isVacancy()) return false;
        }
        return true;
    }

    static #isSameStone(Stone1, Stone2) {
        return Stone1.isStone() && Stone2.isStone() && Stone1.isBlack() === Stone2.isBlack();
    }
}
