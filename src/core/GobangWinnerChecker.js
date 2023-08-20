import { stonesMatchPattern } from "./Gobang";
import Gobang from "./Gobang";
import Game from "./Game";

// current move's index is 0,
// 5 possible positions for current move
const WINNING_PATTERNS = [
    [0, 1, 2, 3, 4],
    [-1, 0, 1, 2, 3],
    [-2, -1, 0, 1, 2],
    [-3, -2, -1, 0, 1],
    [-4, -3, -2, -1, 0]
];

function checkWinner(stones, currentCoordinate) {
    function check5Inline(stones, currentCoordinate, coordinateCalculate) {
        function getNth(n) {
            return Gobang.getNthStoneInLine(stones, currentCoordinate, n, coordinateCalculate);
        }

        for (let winningPattern of WINNING_PATTERNS) {
            if (stonesMatchPattern(winningPattern, getNth)) {
                winningPattern.forEach((i) => getNth(i).setBlink());
                return true;
            }
        }
        return false;
    }

    for (let coordinateCalculator of Game.COORDINATE_CALCULATORS) {
        const winning = check5Inline(stones, currentCoordinate, coordinateCalculator);
        if (winning) {
            return true;
        }
    }
    return false;
}

export default checkWinner;
