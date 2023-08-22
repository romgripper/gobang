import Stone from "./Stone";
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

    // called after stones are updated, history is update, and players are switched in newState
    postProcess(state) {}

    autoDetermineNextStoneCoordinate(state) {}

    createDispatcher() {
        return (state, action) => {
            if (action.type === "placeStone") {
                const coordinate = action.coordinate;
                if (state.hasWinner || state.board.getStone(coordinate).isStone()) {
                    return state;
                }
                const nextBoard = state.board.clone();
                nextBoard.setStone(coordinate, new Stone(state.isNextBlack).setBlink());

                const newState = {
                    isNextBlack: !state.isNextBlack,
                    board: nextBoard,
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
