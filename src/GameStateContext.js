import { createContext, useContext, useReducer, useState, useLayoutEffect } from "react";

import { INITIAL_STATE, process } from "./GameStateProcessor";

const StateContext = createContext(null);
const DispatchContext = createContext(null);
const WindowSizeContext = createContext(null);

export default function StateProvider({ children }) {
    const [state, dispatch] = useReducer(process, INITIAL_STATE);

    const [windowSize, setWindowSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setWindowSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <WindowSizeContext.Provider value={windowSize}>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
            </StateContext.Provider>
        </WindowSizeContext.Provider>
    );
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

export function useWindowSize() {
    return useContext(WindowSizeContext);
}
