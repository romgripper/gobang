import { createContext, useContext, useReducer } from "react";
import getGameInstance from "../core/GameFactory";

const GameContext = createContext(null);
const StateContext = createContext(null);
const DispatchContext = createContext(null);

// game is go or gobang
export default function StateProvider({ gameName, children }) {
    const game = getGameInstance(gameName);
    const [state, dispatch] = useReducer(game.createDispatcher(), game.createInitialState());

    return (
        <GameContext.Provider value={game}>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
            </StateContext.Provider>
        </GameContext.Provider>
    );
}

export function useBoard() {
    return useGameState().board;
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
