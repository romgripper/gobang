import Gobang from "./Gobang";

// current move's index is 0,
// 5 possible positions for current move
const WINNING_PATTERNS = [
    [0, 1, 2, 3, 4],
    [-1, 0, 1, 2, 3],
    [-2, -1, 0, 1, 2],
    [-3, -2, -1, 0, 1],
    [-4, -3, -2, -1, 0]
];

function calculateWinner(squares, latestMove) {
    for (let i = 0; i < Gobang.INDEX_CALCULATORS.length; i++) {
        const winning = check5Inline(squares, latestMove, Gobang.INDEX_CALCULATORS[i]);
        if (winning) {
            return squares[latestMove];
        }
    }
    return null;
}

function check5Inline(squares, currentIndex, indexCalculate) {
    function getNth(n) {
        return Gobang.getNthInLine(squares, currentIndex, n, indexCalculate);
    }

    function mark5InLine(indexPattern) {
        for (let i = 0; i < indexPattern.length; i++) {
            getNth(indexPattern[i]).setIn5();
        }
        return true;
    }

    for (let i = 0; i < WINNING_PATTERNS.length; i++) {
        if (Gobang.playerMarkersMatchPattern(WINNING_PATTERNS[i], getNth)) {
            mark5InLine(WINNING_PATTERNS[i]);
            return true;
        }
    }
    return false;
}

export default calculateWinner;
