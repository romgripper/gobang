import Board from "./Board";

export default class Game {
    ROW_COUNT;
    COLUMN_COUNT;

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

    createInitialBoard() {
        return new Board(this.ROW_COUNT, this.COLUMN_COUNT);
    }

    supportAutoPlacement() {
        return false;
    }

    autoDetermineNextStoneCoordinate(state) {}

    processPlaceStone(state, coordinate) {
        throw new Error("Method 'processPlaceStone()' must be implemented.");
    }

    createDispatcher() {
        return (state, action) => {
            if (action.type === "placeStone") {
                return this.processPlaceStone(state, action.coordinate);
            } else if (action.type === "rollback" && state.previousState) {
                return state.previousState;
            } else if (action.type === "restart") {
                return this.createInitialState();
            }
            return state;
        };
    }
}
