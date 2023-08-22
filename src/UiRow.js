import UiStone from "./UiStone";
import { useGameContext } from "./GameStateContext";

export default function UiRow({ row, height }) {
    const game = useGameContext();
    const columns = [];
    for (let i = 0; i < game.COLUMN_COUNT; i++) {
        columns.push(<UiStone key={`square(${row}, ${i})`} row={row} column={i} size={height} />);
    }
    return <div className="board-row">{columns}</div>;
}
