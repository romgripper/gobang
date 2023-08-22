import GobangUtil from "./GobangUtil";
import BoardStones from "./BoardStones";

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
    #currentCoordinate;

    constructor(board, currentCoordinate) {
        this.#board = board;
        this.#currentCoordinate = currentCoordinate;
    }

    checkWinning() {
        for (let coordinateCalculator of BoardStones.COORDINATE_CALCULATORS) {
            const winning = this.#check5Inline(coordinateCalculator);
            if (winning) {
                return true;
            }
        }
        return false;
    }

    #check5Inline(coordinateCalculate) {
        const getNth = (n) => {
            return this.#board.getNthStoneInLine(this.#currentCoordinate, n, coordinateCalculate);
        };

        for (let winningPattern of WINNING_PATTERNS) {
            if (GobangUtil.stonesMatchPattern(winningPattern, getNth)) {
                winningPattern.forEach((i) => getNth(i).setBlink());
                return true;
            }
        }
        return false;
    }
}
