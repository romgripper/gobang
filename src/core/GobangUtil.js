import InvalidStone from "./InvalidStone";
import Util from "./Util";

export default class GobangUtil {
    static ROW_COUNT = 15;
    static COLUMN_COUNT = 15;

    // return a virtual stone if out of board
    static getNthStoneInLine(stones, currentCoordinate, n, coordinateCalculator) {
        const coordinate = coordinateCalculator(currentCoordinate, n);
        return GobangUtil.#isOutOfBoard(coordinate, GobangUtil.ROW_COUNT, GobangUtil.COLUMN_COUNT)
            ? InvalidStone.getInstance()
            : Util.getStone(stones, coordinate);
    }

    static #isOutOfBoard([row, column]) {
        return row < 0 || row >= this.ROW_COUNT || column < 0 || column >= this.COLUMN_COUNT;
    }

    static stonesMatchPattern(indexPattern, getNth) {
        const first = getNth(indexPattern[0]);
        for (let i = 1; i < indexPattern.length; i++) {
            if (!GobangUtil.#isSameStone(first, getNth(indexPattern[i]))) return false;
        }
        return true;
    }

    static #isSameStone(Stone1, Stone2) {
        return Stone1.isStone() && Stone2.isStone() && Stone1.isBlack() === Stone2.isBlack();
    }
}
