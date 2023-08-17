import Row from "./Row";

import { useGameState, useDispatch, useWindowSize, useGameContext } from "./GameStateContext";

function range(size) {
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(i);
    }
    return a;
}

const BLACK_PLAYER_IMAGE = `${process.env.PUBLIC_URL}/black.png`;
const WHITE_PLAYER_IMAGE = `${process.env.PUBLIC_URL}/white.png`;
const BLACK_PLAYER = "Black";
const WHITE_PLAYER = "White";

export default function Board() {
    const state = useGameState();
    const dispatch = useDispatch();
    const game = useGameContext();
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
        Math.min(windowWidth / (game.COLUMN_COUNT + 2.5), windowHeight / (game.ROW_COUNT + 2.5))
    ); // 2 for margins, 0.5 for paddings
    const boardSize = Math.ceil(squareSize * (game.COLUMN_COUNT + 0.5)); // 0.5 for paddings
    const horizontalMargin = Math.floor((windowWidth - boardSize) / 2);
    const verticalMargin = Math.floor((windowHeight - boardSize) / 4.5);
    const boardPadding = squareSize / 4;
    const fontSize = squareSize / 2.2;
    const statusHeight = squareSize * 0.8;

    const restartButton = (
        <button
            style={{ fontSize: fontSize, marginLeft: squareSize / 2, width: squareSize * 3, height: statusHeight }}
            onClick={() => {
                if (state.hasWinner || window.confirm("Restart the game?")) dispatch({ type: "restart" });
            }}
        >
            Restart
        </button>
    );

    return (
        <div
            className="center"
            style={{
                width: boardSize,
                marginLeft: horizontalMargin,
                marginRight: horizontalMargin,
                marginTop: verticalMargin,
                marginBottom: verticalMargin
            }}
        >
            <div className="status" style={{ width: boardSize, fontSize: fontSize, marginBottom: fontSize }}>
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
            <div className="board" style={{ width: boardSize, padding: boardPadding }}>
                {range(game.ROW_COUNT).map((row) => (
                    <Row row={row} key={"row" + row} height={squareSize} />
                ))}
            </div>
        </div>
    );
}
