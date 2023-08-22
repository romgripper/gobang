import { useBoard, useDispatch } from "./GameStateContext";

export default function Square({ row, column, size }) {
    const stone = useBoard().getStone([row, column]);
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
