import { createContext, useContext, useReducer } from "react";

import Gobang from "./Gobang";
import { PlayerSquare } from "./SquareData";
import checkWinner from "./WinnerChecker";
import { markWarnings } from "./WarningMarker";

const INITIAL_STATE = {
    isNextBlack: true,
    hasWinner: false,
    squares: Gobang.INITIAL_SQUARES,
    previousState: null
};

const StateContext = createContext(null);
const DispatchContext = createContext(null);

export default function StateProvider({ children }) {
    const [state, dispatch] = useReducer(process, INITIAL_STATE);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
}

function process(state, action) {
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
    }
    return state;
}

export function useSquares() {
    return useGameState().squares;
}

export function useGameState() {
    return useContext(StateContext);
}

export function useDispatch() {
    return useContext(DispatchContext);
}
