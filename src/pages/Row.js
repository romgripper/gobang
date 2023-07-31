import { isSquareMarkedByPlayer, isWarning, getPlayer } from "./SquareData";
function isIn5(squareData) {
    return isSquareMarkedByPlayer(squareData) && squareData.isIn5;
}

function isCurrentMove(squareData) {
    return isSquareMarkedByPlayer(squareData) && squareData.isCurrentMove;
}

function Square({ squareData, onSquareClick }) {
    let className = "square";
    const value = isSquareMarkedByPlayer(squareData) ? getPlayer(squareData.isBlack) : "";
    if (isWarning(squareData)) {
        className = "warning";
    } else if (isIn5(squareData)) {
        className = "win";
    } else if (isCurrentMove(squareData)) {
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
                squareData={squares[squareIndex]}
                key={"square" + squareIndex}
                onSquareClick={() => handleClick(squareIndex)}
            />
        );
    }
    return <div className="board-row">{columns}</div>;
}
