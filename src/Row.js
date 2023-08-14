import Gobang from "./Gobang";
import Square from "./Square";

export default function Row({ row, height }) {
    const columns = [];
    for (let i = 0; i < Gobang.COLUMN_COUNT; i++) {
        columns.push(<Square key={`square(${row}, ${i})`} row={row} column={i} size={height} />);
    }
    return <div className="board-row">{columns}</div>;
}
