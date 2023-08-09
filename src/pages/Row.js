import Gobang from "../js/Gobang";
import Square from "./Square";

export function Row({ row }) {
    const columns = [];
    for (let i = 0; i < Gobang.COLUMN_COUNT; i++) {
        columns.push(<Square key={`square(${row}, ${i})`} row={row} column={i} />);
    }
    return <div className="board-row">{columns}</div>;
}
