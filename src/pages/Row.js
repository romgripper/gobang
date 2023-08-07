import Gobang from "./Gobang";

import Square from "./Square";

export function Row({ squares, row, handleClick }) {
    const columns = [];
    let rowStyle = "";
    if (row === 0) {
        rowStyle += "-top";
    } else if (row === Gobang.ROW_COUNT - 1) {
        rowStyle += "-bottom";
    }
    for (let i = 0; i < Gobang.COLUMN_COUNT; i++) {
        let columnStyle = "";
        if (i === 0) {
            columnStyle = "-left";
        } else if (i === Gobang.COLUMN_COUNT - 1) {
            columnStyle = "-right";
        }
        columns.push(
            <Square
                square={squares[i]}
                key={`square(${row}, ${i})`}
                positionStyle={rowStyle + columnStyle}
                onSquareClick={() => handleClick([row, i])}
            />
        );
    }
    return <div className="board-row">{columns}</div>;
}
