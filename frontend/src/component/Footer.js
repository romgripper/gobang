import { useDispatch, useGameContext, useGameState, useSquareSize } from "./UiGame";
import { useState, useEffect } from "react";

export default function Footer() {
    const game = useGameContext();
    const squareSize = useSquareSize();
    const state = useGameState();
    const dispatch = useDispatch();

    const [autoPlacement, setAutoPlacement] = useState(false);
    const [autoPlacementDelay, setAutoPlacementDelay] = useState(2000);

    const fontSize = squareSize / 2.2;

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

    return (
        <>
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
