import Row from "./Row";
import Gobang from "./Gobang";
import { useGameState, useDispatch, useWindowSize } from "./GameStateContext";

function range(size) {
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(i);
    }
    return a;
}

const BLACK_PLAYER_IMAGE = `${process.env.PUBLIC_URL}/black-no-grid.png`;
const WHITE_PLAYER_IMAGE = `${process.env.PUBLIC_URL}/white-no-grid.png`;
const BLACK_PLAYER = "Black";
const WHITE_PLAYER = "White";

export default function Board() {
    const state = useGameState();
    const dispatch = useDispatch();
    const [windowWidth, windowHeight] = useWindowSize();

    let currentPlayerImage;
    let currentPlayer;
    let nextPlayerImage;
    let nextPlayer;

    if (state.isNextBlack) {
        currentPlayerImage = WHITE_PLAYER_IMAGE;
        currentPlayer = WHITE_PLAYER;
        nextPlayerImage = BLACK_PLAYER_IMAGE;
        nextPlayer = BLACK_PLAYER;
    } else {
        currentPlayerImage = BLACK_PLAYER_IMAGE;
        currentPlayer = BLACK_PLAYER;
        nextPlayerImage = WHITE_PLAYER_IMAGE;
        nextPlayer = WHITE_PLAYER;
    }

    const squareSize = Math.floor(
        Math.min(windowWidth / (Gobang.COLUMN_COUNT + 2), windowHeight / (Gobang.ROW_COUNT + 2))
    ); // 2 for margins
    const horizontalMargin = Math.floor((windowWidth - squareSize * Gobang.COLUMN_COUNT) / 2);
    const verticalMargin = Math.floor((windowHeight - squareSize * Gobang.ROW_COUNT) / 4);
    const boardWidth = windowWidth - 2 * horizontalMargin;
    const fontSize = squareSize / 2.2;
    const statusHeight = squareSize * 0.8;

    const restartButton = (
        <button
            style={{ fontSize: fontSize, marginLeft: squareSize / 2, width: squareSize * 3, height: statusHeight }}
            onClick={() => {
                if (window.confirm("Restart the game?")) dispatch({ type: "restart" });
            }}
        >
            Restart
        </button>
    );

    return (
        <div
            className="center"
            style={{
                marginLeft: horizontalMargin,
                marginRight: horizontalMargin,
                marginTop: verticalMargin,
                marginBottom: verticalMargin
            }}
        >
            <div className="status" style={{ width: boardWidth, fontSize: fontSize, marginBottom: fontSize }}>
                {state.hasWinner && (
                    <div>
                        Winner:{" "}
                        <img
                            src={currentPlayerImage}
                            alt={currentPlayer}
                            style={{ width: statusHeight, height: statusHeight }}
                        />
                    </div>
                )}
                {!state.hasWinner && (
                    <div>
                        Player:{" "}
                        <img
                            src={nextPlayerImage}
                            alt={nextPlayer}
                            style={{ width: statusHeight, height: statusHeight }}
                        />
                    </div>
                )}
                <div>
                    {state.previousState && !state.hasWinner && (
                        <button
                            style={{ fontSize: fontSize, width: squareSize * 5, height: statusHeight }}
                            onClick={() => dispatch({ type: "rollback" })}
                        >
                            Back
                        </button>
                    )}
                    {state.previousState && restartButton}
                </div>
            </div>
            <div style={{ width: boardWidth }}>
                {range(Gobang.ROW_COUNT).map((row) => (
                    <Row row={row} key={"row" + row} height={squareSize} />
                ))}
            </div>
        </div>
    );
}