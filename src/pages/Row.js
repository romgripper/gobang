export function Square({ square, onSquareClick }) {
    let className = "square";
    if (square.showWarning()) {
        className += " warning";
    } else if (square.isIn5()) {
        className += " win";
    } else if (square.isLatestMove()) {
        className += " last-move";
    }
    if (square.isMarkedByPlayer()) {
        className += square.isBlack() ? " black" : " white";
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
