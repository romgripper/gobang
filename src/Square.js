import { useStones, useDispatch } from "./GameStateContext";
import GameBase from "./core/GameBase";

export default function Square({ row, column, size }) {
    const stone = GameBase.getStone(useStones(), [row, column]);
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
