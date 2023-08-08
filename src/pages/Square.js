import Gobang from "./Gobang";

export default function Square({ square, row, column, handleClick }) {
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

    function shouldBlink(square) {
        return (
            square.isMarkedByPlayer() &&
            (square.isLatestMove() || square.isIn5() || square.isInOpen3() || square.isInOpen4())
        );
    }

    let className = "square";
    if (square.isMarkedByPlayer()) {
        className += square.isBlack() ? " black" : " white";
    } else {
        className += " empty";
    }
    className += getPositionStyle();
    if (shouldBlink(square)) className += " blink";

    return <button className={className} onClick={() => handleClick([row, column])} />;
}
