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
        if (playersJoined && channel) {
            console.log("Sending event", action);
            await channel.sendEvent(action); // don't send event if playing locally where channel is null
        }
        doDispatch(action);
    }

    useEffect(() => {
        function syncState() {
            const historicalMoves = []; // 2 dimension array
            let s = state;
            // split historical moves in to multiple events so the events won't exceed the limit size
            let movesChunk = [];
            while (s.previousState) {
                movesChunk.unshift(s.latestMove);
                if (movesChunk.length === game.getColumnCount()) {
                    historicalMoves.unshift(movesChunk);
                    movesChunk = [];
                }
                s = s.previousState;
            }
            if (movesChunk.length !== 0) {
                historicalMoves.unshift(movesChunk);
            }

            historicalMoves.forEach((movesChunk) => channel.sendEvent(game.createPlaceStonesAction(movesChunk)));
        }

        const listener = channel.on("user.watching.start", async (event) => {
            console.log("The other player just joined, syncing state");
            if (event.watcher_count === 2) {
                setPlayersJoined(true);
                syncState();
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
                    console.log("Received event from the other player", event);
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
