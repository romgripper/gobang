import Gobang from "./Gobang";
import { useSquares, useDispatch } from "./GameStateContext";

export default function Square({ row, column, size }) {
    const square = Gobang.getSquare(useSquares(), [row, column]);
    const dispatch = useDispatch();

    function getPositionStyle() {
        let positionStyle = "";
        if (row === 0) {
            positionStyle += "-top";
        } else if (row === Gobang.ROW_COUNT - 1) {
            positionStyle += "-bottom";
        }

        if (column === 0) {
            positionStyle += "-left";
        } else if (column === Gobang.COLUMN_COUNT - 1) {
            positionStyle += "-right";
        }
        return positionStyle;
    }

    function shouldBlink() {
        return square.isLatestMove() || square.isIn5() || square.isInOpen3() || square.isInOpen4();
    }

    let className = "square";
    if (square.isMarkedByPlayer()) {
        className += square.isBlack() ? " black" : " white";
        className += getPositionStyle();
        if (shouldBlink(square)) className += " blink";
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
