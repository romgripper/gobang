import { createContext, useContext, useReducer, useEffect } from "react";
import { createDispatcher } from "./GameStateProcessor";
import Game from "./core/Game";

const GameContext = createContext(null);
const StateContext = createContext(null);
const DispatchContext = createContext(null);

// game is go or gobang
export default function StateProvider({ gameName, children }) {
    const game = Game[gameName];
    const [state, dispatch] = useReducer(createDispatcher(game), game.createInitialState());

    return (
        <GameContext.Provider value={game}>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
            </StateContext.Provider>
        </GameContext.Provider>
    );
}

export function useSquares() {
    return useGameState().squares;
}

export function useGameState() {
    return useContext(StateContext);
}

export function useGameContext() {
    return useContext(GameContext);
}

export function useDispatch() {
    return useContext(DispatchContext);
}
