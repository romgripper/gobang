import Gobang from "./Gobang";
import { useSquares, useDispatch } from "./GameStateContext";

export default function Square({ row, column, size }) {
    const square = Gobang.getSquare(useSquares(), [row, column]);
    const dispatch = useDispatch();

    function shouldBlink() {
        return square.isLatestMove() || square.isIn5() || square.isInOpen3() || square.isInOpen4();
    }

    let className = "square";
    if (square.isMarkedByPlayer()) {
        className += square.isBlack() ? " black" : " white";
        if (shouldBlink(square)) {
            className += " blink";
        }
    }

    return (
        <button
            className={className}
            style={{ width: size, height: size }}
            onClick={() =>
                dispatch({
                    type: "click",
                    coordinate: [row, column]
                })
            }
        />
    );
}
