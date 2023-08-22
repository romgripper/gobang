import InvalidStone from "./InvalidStone";
import Vacancy from "./Vacancy";

export default class BoardStones {
    #stones;
    #rowCount;
    #columnCount;

    constructor(rowCount, columnCount) {
        this.#rowCount = rowCount;
        this.#columnCount = columnCount;
        this.#stones = Array(rowCount)
            .fill(null)
            .map(() => Array(columnCount).fill(null));
    }

    getRowCount() {
        return this.#rowCount;
    }

    getColumnCount() {
        return this.#columnCount;
    }

    clone() {
        const cloned = new BoardStones(this.#rowCount, this.#columnCount);
        for (let i = 0; i < this.#rowCount; i++) {
            for (let j = 0; j < this.#columnCount; j++) {
                const coordinate = [i, j];
                const stone = this.#getStone(coordinate);
                if (stone) cloned.setStone(coordinate, stone.clone());
            }
        }
        return cloned;
    }

    #getStone([row, column]) {
        return this.#stones[row][column];
    }

    getStone([row, column]) {
        if (this.#isOutOfBoard([row, column])) {
            return InvalidStone.getInstance();
        }
        return this.#getStone([row, column]) || Vacancy.getInstance();
    }

    setStone([row, column], Stone) {
        if (this.#isOutOfBoard([row, column])) {
            throw new Error("Out of board");
        }
        this.#stones[row][column] = Stone;
    }

    #isOutOfBoard([row, column]) {
        return row < 0 || row >= this.#rowCount || column < 0 || column >= this.#columnCount;
    }
}
