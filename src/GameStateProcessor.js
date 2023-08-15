import Gobang from "./Gobang";
import { PlayerSquare } from "./SquareData";
import checkWinner from "./WinnerChecker";
import { markWarnings } from "./WarningMarker";

export const INITIAL_STATE = {
    isNextBlack: true,
    hasWinner: false,
    squares: Gobang.INITIAL_SQUARES,
    previousState: null
};

export function process(state, action) {
    if (action.type === "click") {
        const coordinate = action.coordinate;
        if (state.hasWinner || Gobang.getSquare(state.squares, coordinate).isMarkedByPlayer()) {
            return state;
        }

        const nextSquares = state.squares.map((row) => row.map((square) => square.clone()));

        Gobang.setSquare(nextSquares, coordinate, new PlayerSquare(state.isNextBlack).setLatestMove(true));

        const hasWinner = checkWinner(nextSquares, coordinate);
        if (!hasWinner) {
            markWarnings(nextSquares, coordinate);
        }

        return {
            isNextBlack: !state.isNextBlack,
            hasWinner: hasWinner,
            squares: nextSquares,
            previousState: state
        };
    } else if (action.type === "rollback" && state.previousState) {
        return state.previousState;
    } else if (action.type === "restart") {
        return INITIAL_STATE;
    }
    return state;
}
