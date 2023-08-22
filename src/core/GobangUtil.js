export default class GobangUtil {
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
