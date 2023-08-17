import { PlayerSquare } from "./SquareData";
import checkWinner from "./GobangWinnerChecker";
import markWarnings from "./GobangWarningMarker";

export function createInitialState(game) {
    return {
        isNextBlack: true,
        hasWinner: false,
        squares: game.INITIAL_SQUARES,
        previousState: null
    };
}

export function createDispatcher(game) {
    return (state, action) => {
        if (action.type === "click") {
            const coordinate = action.coordinate;
            if (state.hasWinner || game.getSquare(state.squares, coordinate).isMarkedByPlayer()) {
                return state;
            }

            const nextSquares = state.squares.map((row) => row.map((square) => square.clone()));

            game.setSquare(nextSquares, coordinate, new PlayerSquare(state.isNextBlack).setLatestMove(true));

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
            return createInitialState(game);
        }
        return state;
    };
}
