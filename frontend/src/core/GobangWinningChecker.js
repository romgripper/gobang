import Line from "./Line";

// current move's index is 0,
// 5 possible positions for current move
const WINNING_PATTERNS = [
    [0, 1, 2, 3, 4],
    [-1, 0, 1, 2, 3],
    [-2, -1, 0, 1, 2],
    [-3, -2, -1, 0, 1],
    [-4, -3, -2, -1, 0]
];
export default class GobangWinnerChecker {
    #board;
    #latestStoneCoordinate;

    constructor(board, latestStoneCoordinate) {
        this.#board = board;
        this.#latestStoneCoordinate = latestStoneCoordinate;
    }

    checkWinning() {
        for (let line of Line.LINES) {
            const winning = this.#check5Inline(line);
            if (winning) {
                return true;
            }
        }
        return false;
    }

    #check5Inline(line) {
        const stonesInLine = new Line(this.#board, this.#latestStoneCoordinate, line);

        for (let winningPattern of WINNING_PATTERNS) {
            if (stonesInLine.stonesMatchPattern(winningPattern)) {
                winningPattern.forEach((i) => stonesInLine.getNth(i).setBlink());
                return true;
            }
        }
        return false;
    }
}
