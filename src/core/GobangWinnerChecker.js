import GobangUtils from "./GobangUtils";

// current move's index is 0,
// 5 possible positions for current move
const WINNING_PATTERNS = [
    [0, 1, 2, 3, 4],
    [-1, 0, 1, 2, 3],
    [-2, -1, 0, 1, 2],
    [-3, -2, -1, 0, 1],
    [-4, -3, -2, -1, 0]
];

function checkWinner(squares, currentCoordinate) {
    for (let coordinateCalculator of GobangUtils.COORDINATE_CALCULATORS) {
        const winning = check5Inline(squares, currentCoordinate, coordinateCalculator);
        if (winning) {
            return true;
        }
    }
    return false;
}

function check5Inline(squares, currentCoordinate, coordinateCalculate) {
    function getNth(n) {
        return GobangUtils.getNthSquareInLine(squares, currentCoordinate, n, coordinateCalculate);
    }

    for (let winningPattern of WINNING_PATTERNS) {
        if (GobangUtils.stonesMatchPattern(winningPattern, getNth)) {
            winningPattern.forEach((i) => getNth(i).setBlink());
            return true;
        }
    }
    return false;
}

export default checkWinner;
