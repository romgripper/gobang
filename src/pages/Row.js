function Square({ square, onSquareClick }) {
    function shouldBlink(square) {
        return square.isLatestMove() || square.isIn5();
    }

    let className = "square";
    if (square.isMarkedByPlayer()) {
        className += square.isBlack() ? " black" : " white";
        if (shouldBlink(square)) className += "-blink";
    } else if (square.showWarning()) {
        className += " warning";
    }

    return <button className={className} onClick={onSquareClick} />;
}

export function Row({ squares, row, columnCount, handleClick }) {
    const columns = [];
    for (let i = 0; i < columnCount; i++) {
        columns.push(<Square square={squares[i]} key={"square" + i} onSquareClick={() => handleClick([row, i])} />);
    }
    return <div className="board-row">{columns}</div>;
}
