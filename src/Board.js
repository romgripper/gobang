import Row from "./Row";
import Gobang from "./Gobang";
import { useGameState, useDispatch } from "./GameStateContext";

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

    return (
        <div className="center">
            <div className="status">
                {state.hasWinner && (
                    <div>
                        Winner: <img src={currentPlayerImage} alt={currentPlayer} />
                    </div>
                )}
                {!state.hasWinner && (
                    <div>
                        Next player: <img src={nextPlayerImage} alt={nextPlayer} />
                        {state.previousState && (
                            <button
                                onClick={() => dispatch({ type: "rollback" })}
                                style={{ marginLeft: 20 }}
                            >
                                Back
                            </button>
                        )}
                    </div>
                )}
            </div>
            {range(Gobang.ROW_COUNT).map((row) => (
                <Row row={row} key={"row" + row} />
            ))}
        </div>
    );
}
