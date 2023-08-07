export default function Square({ square, positionStyle, onSquareClick }) {
    function shouldBlink(square) {
        return square.isLatestMove() || square.isIn5() || square.isInOpen3() || square.isInOpen4();
    }

    let className = "square";
    if (square.isMarkedByPlayer()) {
        className += square.isBlack() ? " black" : " white";
        className += positionStyle;
        if (shouldBlink(square)) className += " blink";
    } else {
        className += " empty" + positionStyle;
    }

    return <button className={className} onClick={onSquareClick} />;
}
