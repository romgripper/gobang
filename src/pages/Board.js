import { useState } from "react";

import { Row } from "./Row";
import { PlayerSquare } from "./SquareData";
import Gobang from "./Gobang";
import calculateWinner from "./WinnerChecker";
import { markWarnings } from "./WarningMarker";

function range(size) {
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(i);
    }
    return a;
}

const INITIAL_STATE = {
    isNextBlack: true,
    winner: null,
    squares: Gobang.INITIAL_SQAURES,
    previousState: null
};

export default function Board() {
    const [state, setState] = useState(INITIAL_STATE);

    function takeTurn(nextState) {
        nextState.isNextBlack = !state.isNextBlack;
    }

    function handleClick(coordinate) {
        if (state.winner || Gobang.getSquare(state.squares, coordinate).isMarkedByPlayer()) {
            return;
        }

        const nextSquares = state.squares.map((row) => row.map((square) => square.clone()));

        Gobang.setSquare(nextSquares, coordinate, new PlayerSquare(state.isNextBlack).setLatestMove(true));

        const winner = calculateWinner(nextSquares, coordinate);
        if (!winner) {
            markWarnings(nextSquares, coordinate);
        }

        setState({
            isNextBlack: !state.isNextBlack,
            winner: winner,
            squares: nextSquares,
            previousState: state
        });
    }

    function rollback() {
        if (state.previousState) {
            setState(state.previousState);
        }
    }

    return (
        <div className="center">
            <div className="status">
                {state.winner && (
                    <div>
                        Winner: <img src={state.isNextBlack ? "/white-no-grid.png" : "/black-no-grid.png"} />
                    </div>
                )}
                {!state.winner && (
                    <div>
                        Next player: <img src={state.isNextBlack ? "/black-no-grid.png" : "/white-no-grid.png"} />
                        {state.previousState && (
                            <button onClick={rollback} style={{ marginLeft: 20, heigth: 40 }}>
                                Back
                            </button>
                        )}
                    </div>
                )}
            </div>
            {range(Gobang.ROW_COUNT).map((row) => (
                <Row
                    squares={Gobang.getRow(state.squares, row)}
                    row={row}
                    key={"row" + row}
                    handleClick={handleClick}
                />
            ))}
        </div>
    );
}
