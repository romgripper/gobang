function Square({ data, onSquareClick }) {
    let className = "square";
    const value = data.getPlayer();
    if (data.showWarning()) {
        className += " warning";
    } else if (data.isIn5()) {
        className += " win";
    } else if (data.isLatestMove()) {
        className += " last-move";
    }

    return (
        <button className={className} onClick={onSquareClick}>
            {value}
        </button>
    );
}

export default function Row({ squares, row, columnCount, handleClick }) {
    const columns = [];
    for (let i = 0; i < columnCount; i++) {
        columns.push(<Square data={squares[i]} key={"square" + i} onSquareClick={() => handleClick([row, i])} />);
    }
    return <div className="board-row">{columns}</div>;
}
