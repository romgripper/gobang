import { useState } from "react";

import { Row } from "./Row";
import { PlayerSquare } from "./SquareData";
import Gobang from "./Gobang";
import calculateWinner from "./WinnerChecker";
import { markWarnings } from "./WarningMarker";

const MAX_HISTORY_COUNT = 9;

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
    history: [Gobang.INITIAL_SQAURES]
};

export default function Board() {
    const [state, setState] = useState(INITIAL_STATE);

    function takeTurn(nextState) {
        nextState.isNextBlack = !state.isNextBlack;
    }

    function handleClick(coordinate) {
        const squares = state.history[0];
        if (state.winner || Gobang.getSquare(squares, coordinate).isMarkedByPlayer()) {
            return;
        }

        const nextState = {};
        const nextSquares = squares.map((row) => row.map((square) => square.clone()));

        Gobang.setSquare(nextSquares, coordinate, new PlayerSquare(state.isNextBlack).setLatestMove(true));

        nextState.winner = calculateWinner(nextSquares, coordinate);
        if (!nextState.winner) {
            markWarnings(nextSquares, coordinate);
        }
        updateHistory(nextState, nextSquares, coordinate);
        takeTurn(nextState);
        setState(nextState);
    }

    function updateHistory(nextState, nextSquares) {
        nextState.history = state.history.slice();
        nextState.history.unshift(nextSquares);
        if (nextState.history.length > MAX_HISTORY_COUNT + 1) {
            nextState.history.pop();
        }
    }

    function rollback() {
        if (history.length > 1) {
            // the initial history must stay
            const nextState = {};
            nextState.history = state.history.slice();
            nextState.squares = nextState.history.shift();
            takeTurn(nextState);
            setState(nextState);
        }
    }

    const squares = state.history[0];
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
                        Next player: <img src={state.isNextBlack ? "/black-no-grid.png" : "/white-no-grid.png"} />{" "}
                        &nbsp; &nbsp; History: {state.history.length - 1}{" "}
                        {state.history.length > 0 && (
                            <button onClick={rollback} style={{ marginLeft: 20, heigth: 40 }}>
                                Back
                            </button>
                        )}
                    </div>
                )}
            </div>
            {range(Gobang.ROW_COUNT).map((row) => (
                <Row squares={Gobang.getRow(squares, row)} row={row} key={"row" + row} handleClick={handleClick} />
            ))}
        </div>
    );
}
