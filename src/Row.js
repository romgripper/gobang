import Square from "./Square";
import { useGameContext } from "./GameStateContext";

export default function Row({ row, height }) {
    const game = useGameContext();
    const columns = [];
    for (let i = 0; i < game.COLUMN_COUNT; i++) {
        columns.push(<Square key={`square(${row}, ${i})`} row={row} column={i} size={height} />);
    }
    return <div className="board-row">{columns}</div>;
}
