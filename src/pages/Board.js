import { Row } from "./Row";
import Gobang from "./Gobang";
import { useState, useDispatch } from "./StateContext";

function range(size) {
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(i);
    }
    return a;
}

export default function Board() {
    const state = useState();
    const dispatch = useDispatch();

    const currentPlayerImage = state.isNextBlack ? "/white-no-grid.png" : "/black-no-grid.png";
    const nextPlayerImage = state.isNextBlack ? "/black-no-grid.png" : "/white-no-grid.png";

    return (
        <div className="center">
            <div className="status">
                {state.hasWinner && (
                    <div>
                        Winner: <img src={currentPlayerImage} />
                    </div>
                )}
                {!state.hasWinner && (
                    <div>
                        Next player: <img src={nextPlayerImage} />
                        {state.previousState && (
                            <button
                                onClick={() => dispatch({ type: "rollback" })}
                                style={{ marginLeft: 20, heigth: 40 }}
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
