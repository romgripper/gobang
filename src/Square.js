import { useSquares, useDispatch } from "./GameStateContext";
import GameBase from "./core/GameBase";

export default function Square({ row, column, size }) {
    const square = GameBase.getSquare(useSquares(), [row, column]);
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
