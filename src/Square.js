import { useSquares, useDispatch } from "./GameStateContext";
import { useGameContext } from "./GameStateContext";

export default function Square({ row, column, size }) {
    const game = useGameContext();
    const square = game.getSquare(useSquares(), [row, column]);
    const dispatch = useDispatch();

    let className = "square";
    if (square.hasStone()) {
        className += square.isBlack() ? " black" : " white";
        className += square.isBlink() ? " blink" : "";
    }

    return (
        <button
            className={className}
            style={{ width: size, height: size }}
            onClick={() =>
                dispatch({
                    type: "placeStone",
                    coordinate: [row, column]
                })
            }
        />
    );
}
