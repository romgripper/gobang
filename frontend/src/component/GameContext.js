import { createContext, useContext, useReducer, useLayoutEffect, useState, useEffect } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import getGameInstance from "../core/GameFactory";

const GameContext = createContext(null);
const StateContext = createContext(null);
const SquareSizeContext = createContext(null);
const DispatchContext = createContext(null);
const PlayerJoinedContext = createContext(null);

// game is go or gobang
export default function Game({ gameName, children }) {
    const { client } = useChatContext();
    const { channel } = useChannelStateContext();

    const [playersJoined, setPlayersJoined] = useState(channel.state.watcher_count === 2);
    const [windowSize, setWindowSize] = useState([0, 0]);

    const game = getGameInstance(gameName);
    const [state, doDispatch] = useReducer(game.createDispatcher(), game.createInitialState());

    async function dispatch(action) {
        if (channel) await channel.sendEvent(action); // don't send event if playing locally where channel is null
        doDispatch(action);
    }

    useEffect(() => {
        const listener = channel.on("user.watching.start", (event) => {
            if (event.watcher_count === 2) {
                setPlayersJoined(true);
                const actions = game.createSetStateActions(state);
                actions.forEach(async (action) => {
                    if (channel) await channel.sendEvent(action); // don't send event if playing locally where channel is null
                    doDispatch(action);
                });
            }
        });
        return () => listener.unsubscribe();
    }, [channel, game, state]);

    useLayoutEffect(() => {
        function updateSize() {
            setWindowSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        if (channel && client) {
            const listener = channel.on((event) => {
                if (event.user.id !== client.userID) {
                    doDispatch(event);
                }
            });
            return () => listener.unsubscribe();
        }
    }, [channel, client]);

    const [windowWidth, windowHeight] = windowSize;
    const squareSize = Math.floor(
        Math.min(windowWidth / (game.COLUMN_COUNT + 2.5), windowHeight / (game.ROW_COUNT + 2.5))
    ); // horizontally 2 for margins, 0.5 for paddings
    const boardSize = Math.ceil(squareSize * (game.COLUMN_COUNT + 0.5)); // 0.5 for paddings
    const horizontalMargin = Math.floor((windowWidth - boardSize) / 2);
    const verticalMargin = Math.floor((windowHeight - boardSize) / 4.5);

    return (
        <PlayerJoinedContext.Provider value={playersJoined}>
            <GameContext.Provider value={game}>
                <StateContext.Provider value={state}>
                    <DispatchContext.Provider value={dispatch}>
                        <SquareSizeContext.Provider value={squareSize}>
                            <div
                                className="main"
                                style={{
                                    width: boardSize,
                                    marginLeft: horizontalMargin,
                                    marginRight: horizontalMargin,
                                    marginTop: verticalMargin
                                }}
                            >
                                {children}
                            </div>
                        </SquareSizeContext.Provider>
                    </DispatchContext.Provider>
                </StateContext.Provider>
            </GameContext.Provider>
        </PlayerJoinedContext.Provider>
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

export function useSquareSize() {
    return useContext(SquareSizeContext);
}

export function usePlayerJoined() {
    return useContext(PlayerJoinedContext);
}
