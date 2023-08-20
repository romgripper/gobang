import { Stone } from "./Stone";
import Util from "./Util";

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

    createInitialStones() {
        return Array(this.ROW_COUNT)
            .fill(null)
            .map(() => Array(this.COLUMN_COUNT).fill(null));
    }

    // called after stones are updated, history is update, and players are switched in newState
    postProcess(state) {}

    determineNextStoneCoordinate(state) {}

    createDispatcher() {
        return (state, action) => {
            if (action.type === "placeStone") {
                const coordinate = action.coordinate;
                if (state.hasWinner || Util.getStone(state.stones, coordinate).isStone()) {
                    return state;
                }
                const nextStones = state.stones.map((row) => row.map((Stone) => (Stone ? Stone.clone() : null)));
                Util.setStone(nextStones, coordinate, new Stone(state.isNextBlack).setBlink());

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
