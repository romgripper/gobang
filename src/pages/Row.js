function Square({ data, onSquareClick }) {
    let className = "square";
    const value = data.getPlayer();
    if (data.showWarning()) {
        className = "warning";
    } else if (data.isIn5()) {
        className = "win";
    } else if (data.isCurrentMove()) {
        className = "last-move";
    }

    return (
        <button className={className} onClick={onSquareClick}>
            {value}
        </button>
    );
}

export default function Row({ squares, startIndex, columnCount, handleClick }) {
    let columns = [];
    for (let i = 0; i < columnCount; i++) {
        const squareIndex = startIndex + i;
        columns.push(
            <Square
                data={squares[squareIndex]}
                key={"square" + squareIndex}
                onSquareClick={() => handleClick(squareIndex)}
            />
        );
    }
    return <div className="board-row">{columns}</div>;
}
