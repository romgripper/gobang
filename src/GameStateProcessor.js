import { PlayerSquare } from "./core/SquareData";

export function createInitialState(game) {
    return {
        isNextBlack: true,
        hasWinner: false,
        squares: game.createInitialSquares(),
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

            const hasWinner = game.postProcess(nextSquares, coordinate);

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
