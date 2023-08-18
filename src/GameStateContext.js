import { createContext, useContext, useReducer, useState, useLayoutEffect, useEffect } from "react";
import { createDispatcher } from "./GameStateProcessor";
import Game from "./core/Game";

const GameContext = createContext(null);
const StateContext = createContext(null);
const DispatchContext = createContext(null);
const WindowSizeContext = createContext(null);

// game is go or gobang
export default function StateProvider({ gameName, children }) {
    const game = Game[gameName];
    const [state, dispatch] = useReducer(createDispatcher(game), game.createInitialState());

    const [windowSize, setWindowSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setWindowSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        let timeoutId = null;
        const coordinate = game.autoPlace(state);
        if (coordinate) {
            timeoutId = setTimeout(() => {
                dispatch({ type: "placeStone", coordinate: coordinate });
            }, 1000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [game, state]);

    return (
        <WindowSizeContext.Provider value={windowSize}>
            <GameContext.Provider value={game}>
                <StateContext.Provider value={state}>
                    <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
                </StateContext.Provider>
            </GameContext.Provider>
        </WindowSizeContext.Provider>
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

export function useWindowSize() {
    return useContext(WindowSizeContext);
}
