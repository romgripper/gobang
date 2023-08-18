import { Stone } from "./core/SquareData";

export function createInitialState(game) {
    return {
        isNextBlack: true,
        hasWinner: false,
        squares: game.createInitialSquares(),
        latestStoneCoordinate: null,
        previousState: null
    };
}

export function createDispatcher(game) {
    return (state, action) => {
        if (action.type === "placeStone") {
            const coordinate = action.coordinate;
            if (state.hasWinner || game.getSquare(state.squares, coordinate).hasStone()) {
                return state;
            }

            const nextSquares = state.squares.map((row) => row.map((square) => (square ? square.clone() : null)));
            game.setSquare(nextSquares, coordinate, new Stone(state.isNextBlack).setBlink());

            const newState = {
                isNextBlack: !state.isNextBlack,
                squares: nextSquares,
                latestStoneCoordinate: coordinate,
                previousState: state
            };

            game.postProcess(newState);

            return newState;
        } else if (action.type === "rollback" && state.previousState) {
            return state.previousState;
        } else if (action.type === "restart") {
            return createInitialState(game);
        }
        return state;
    };
}
