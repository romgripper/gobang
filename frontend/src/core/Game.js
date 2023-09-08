import Board from "./Board";
import Stone from "./Stone";

export default class Game {
    static #PLACE_STONE = "placeStone";
    static #ROLLBACK = "rollback";
    static #RESTART = "restart";
    static #SET_STATE = "setState";
    static #SET_ROW = "setRow";

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

    createSetStateActions(state) {
        const stateClone = { ...state };
        delete stateClone.board;
        stateClone.previousState = null; // the event message is not big enough to contain history
        const actions = [];
        actions.push({ type: Game.#SET_STATE, state: stateClone });
        state.board
            .getRows()
            .forEach((row, rowIndex) => actions.push({ type: Game.#SET_ROW, row: row.map(Stone.toInt), rowIndex }));
        return actions;
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
                case Game.#SET_STATE:
                    action.state.board = state.board;
                    return action.state;
                case Game.#SET_ROW:
                    state.board.setRow(action.row.map(Stone.fromInt), action.rowIndex);
                    return state;
                default:
                    return state;
            }
        };
    }
}
