import UiRow from "./UiRow";
import { useGameState, useDispatch, useGameContext, useSquareSize } from "./UiGame";
import { useState, useEffect } from "react";

function range(size) {
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(i);
    }
    return a;
}

export default function UiBoard() {
    const state = useGameState();
    const dispatch = useDispatch();
    const game = useGameContext();

    const [autoPlacement, setAutoPlacement] = useState(false);
    const [autoPlacementDelay, setAutoPlacementDelay] = useState(2000);

    useEffect(() => {
        if (!game.supportAutoPlacement() || !autoPlacement) return;

        let timeoutId = null;
        const coordinate = game.autoDetermineNextStoneCoordinate(state);
        if (coordinate) {
            timeoutId = setTimeout(() => {
                dispatch({ type: "placeStone", coordinate: coordinate });
            }, autoPlacementDelay);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [game, state, dispatch, autoPlacement, autoPlacementDelay]);

    const squareSize = useSquareSize();
    const boardPadding = squareSize / 4;
    const fontSize = squareSize / 2.2;

    return (
        <>
            <div className={game.getName() + " board"} style={{ width: "100%", padding: boardPadding }}>
                {range(game.ROW_COUNT).map((row) => (
                    <UiRow row={row} key={"row" + row} height={squareSize} />
                ))}
            </div>
            {game.supportAutoPlacement() && (
                <div
                    className="auto"
                    style={{
                        marginTop: squareSize / 2,
                        fontSize: fontSize
                    }}
                >
                    <div>
                        <label style={{ width: 3 * squareSize }}>
                            <input
                                type="checkbox"
                                checked={autoPlacement}
                                value="1"
                                onChange={(e) => console.log("Checkbox onChange", e.target.checked)}
                                // onChange works locally but won't be fired on github pages
                                onClick={(e) => {
                                    setAutoPlacement(e.target.checked);
                                }}
                            ></input>
                            Auto
                        </label>
                    </div>
                    {autoPlacement && (
                        <div>
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                value={autoPlacementDelay}
                                step="100"
                                onChange={(e) => setAutoPlacementDelay(e.target.value)}
                                style={{ width: squareSize * (game.COLUMN_COUNT - 5.5) }}
                            ></input>
                            <span style={{ marginLeft: squareSize / 4 }}>{autoPlacementDelay}ms</span>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
