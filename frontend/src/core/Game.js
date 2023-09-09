import Board from "./Board";

export default class Game {
    static #PLACE_STONE = "placeStone";
    static #ROLLBACK = "rollback";
    static #RESTART = "restart";
    static #PLACE_STONES = "placeStones";

    ROW_COUNT;
    COLUMN_COUNT;

    constructor(rowCount, columnCount) {
        this.ROW_COUNT = rowCount;
        this.COLUMN_COUNT = columnCount;
    }

    getRowCount() {
        return this.ROW_COUNT;
    }

    getColumnCount() {
        return this.COLUMN_COUNT;
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
            coordinate
        };
    }

    createPlaceStonesAction(coordinates) {
        return {
            type: Game.#PLACE_STONES,
            coordinates
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
            switch (action.type) {
                case Game.#PLACE_STONE:
                    return this.processPlaceStone(state, action.coordinate);
                case Game.#ROLLBACK:
                    return state.previousState || state;
                case Game.#RESTART:
                    return this.createInitialState();
                case Game.#PLACE_STONES:
                    let newState = state;
                    for (let coordinate of action.coordinates) {
                        newState = this.processPlaceStone(newState, coordinate);
                    }
                    return newState;
                default:
                    return state;
            }
        };
    }
}
