import { useStones, useDispatch } from "./GameStateContext";
import Game from "./core/Game";

export default function Square({ row, column, size }) {
    const stone = Game.getStone(useStones(), [row, column]);
    const dispatch = useDispatch();

    let className = "square";
    if (stone.isStone()) {
        className += stone.isBlack() ? " black" : " white";
        className += stone.isBlink() ? " blink" : "";
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
