import Gobang from "./Gobang";
import Square from "./Square";

export function Row({ squares, row, handleClick }) {
    const columns = [];
    for (let i = 0; i < Gobang.COLUMN_COUNT; i++) {
        columns.push(
            <Square square={squares[i]} key={`square(${row}, ${i})`} row={row} column={i} handleClick={handleClick} />
        );
    }
    return <div className="board-row">{columns}</div>;
}
