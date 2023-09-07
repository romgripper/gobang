import { useGameContext, useSquareSize } from "./GameContext";
import UiRow from "./UiRow";

function range(size) {
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(i);
    }
    return a;
}

export default function UiBoard() {
    const game = useGameContext();

    const squareSize = useSquareSize();
    const boardPadding = squareSize / 4;

    return (
        <div className={game.getName() + " board"} style={{ padding: boardPadding }}>
            {range(game.ROW_COUNT).map((row) => (
                <UiRow row={row} key={"row" + row} height={squareSize} />
            ))}
        </div>
    );
}
