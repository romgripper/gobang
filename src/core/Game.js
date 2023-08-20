import { Stone, NoStone } from "./Stone";

export default class Game {
    ROW_COUNT;
    COLUMN_COUNT;

    static COORDINATE_CALCULATORS = [
        ([row, column], n) => [row, column + n], // row
        ([row, column], n) => [row + n, column], // column
        ([row, column], n) => [row + n, column + n], // diagonal 1
        ([row, column], n) => [row + n, column - n] // diagonal 2
    ];

    constructor(rowCount, columnCount) {
        this.ROW_COUNT = rowCount;
        this.COLUMN_COUNT = columnCount;
    }

    getName() {
        throw new Error("Method 'getName()' must be implemented.");
    }

    createInitialState() {
        throw new Error("Method 'createInitialState()' must be implemented.");
    }

    createInitialStones() {
        return Array(this.ROW_COUNT)
            .fill(null)
            .map(() => Array(this.COLUMN_COUNT).fill(null));
    }

    static isOutOfBoard([row, column], rowCount, columnCount) {
        return row < 0 || row >= rowCount || column < 0 || column >= columnCount;
    }

    // called after stones are updated, history is update, and players are switched in newState
    postProcess(state) {}

    determineNextStoneCoordinate(state) {}

    static getStone(stones, [row, column]) {
        return stones[row][column] || new NoStone();
    }

    static getRow(stones, row) {
        return stones[row];
    }

    static setStone(stones, [row, column], Stone) {
        stones[row][column] = Stone;
    }

    createDispatcher() {
        return (state, action) => {
            if (action.type === "placeStone") {
                const coordinate = action.coordinate;
                if (state.hasWinner || Game.getStone(state.stones, coordinate).isStone()) {
                    return state;
                }
                const nextStones = state.stones.map((row) => row.map((Stone) => (Stone ? Stone.clone() : null)));
                Game.setStone(nextStones, coordinate, new Stone(state.isNextBlack).setBlink());

                const newState = {
                    isNextBlack: !state.isNextBlack,
                    stones: nextStones,
                    latestStoneCoordinate: coordinate,
                    previousState: state
                };

                this.postProcess(newState);

                return newState;
            } else if (action.type === "rollback" && state.previousState) {
                return state.previousState;
            } else if (action.type === "restart") {
                return this.createInitialState();
            }
            return state;
        };
    }
}
