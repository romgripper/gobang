import Board from "./Board";

export default class Game {
    static #PLACE_STONE = "placeStone";
    static #ROLLBACK = "rollback";
    static #RESTART = "restart";

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

    createPlaceStoneAction(coordinate) {
        return {
            type: Game.#PLACE_STONE,
            coordinate: coordinate
        };
    }

    createRollbackAction() {
        return {
            type: Game.#ROLLBACK
        };
    }

    createRestartAction() {
        return {
            type: Game.#RESTART
        };
    }

    createDispatcher() {
        return (state, action) => {
            if (action.type === Game.#PLACE_STONE) {
                return this.processPlaceStone(state, action.coordinate);
            } else if (action.type === Game.#ROLLBACK && state.previousState) {
                return state.previousState;
            } else if (action.type === Game.#RESTART) {
                return this.createInitialState();
            }
            return state;
        };
    }
}
