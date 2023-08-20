import { createContext, useContext, useReducer } from "react";
import Go from "./core/Go";
import Gobang from "./core/Gobang";

const GameContext = createContext(null);
const StateContext = createContext(null);
const DispatchContext = createContext(null);

// game is go or gobang
export default function StateProvider({ gameName, children }) {
    const game = gameName === "go" ? new Go() : new Gobang();
    const [state, dispatch] = useReducer(game.createDispatcher(), game.INITIAL_STATE);

    return (
        <GameContext.Provider value={game}>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
            </StateContext.Provider>
        </GameContext.Provider>
    );
}

export function useStones() {
    return useGameState().stones;
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
