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
    history: [[Gobang.INITIAL_SQAURES, null]]
};

function getLatestSquares(state) {
    if (state.history.length > 0) {
        return state.history[0][0];
    }
}

function getLatestMove(state) {
    if (state.history.length > 0) {
        return state.history[0][1];
    }
}

export default function Board() {
    const [state, setState] = useState(INITIAL_STATE);

    function takeTurn(nextState) {
        nextState.isNextBlack = !state.isNextBlack;
    }

    function handleClick(coordinate) {
        if (state.winner || Gobang.getSquare(getLatestSquares(state), coordinate).isMarkedByPlayer()) {
            return;
        }

        const squares = getLatestSquares(state);
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

    function updateHistory(nextState, nextSquares, currentMove) {
        nextState.history = state.history.slice();
        nextState.history.unshift([nextSquares, currentMove]);
        if (nextState.history.length > MAX_HISTORY_COUNT + 1) {
            nextState.history.pop();
        }
    }

    function rollback() {
        if (history.length > 1) {
            // the initial history must stay
            const nextState = {};
            nextState.history = state.history.slice();
            [nextState.squares, nextState.lastMove] = nextState.history.shift();
            takeTurn(nextState);
            setState(nextState);
        }
    }

    return (
        <div className="center">
            <div className="status">
                {state.winner && (
                    <div>
                        Winner:{" "}
                        <img
                            src={
                                Gobang.getSquare(getLatestSquares(state), getLatestMove(state)).isBlack()
                                    ? "/black-no-grid.png"
                                    : "/white-no-grid.png"
                            }
                        />
                    </div>
                )}
                {!state.winner && (
                    <div>
                        Next player:{" "}
                        <img src={state.isNextBlack ? "/black-no-grid.png" : "/white-no-grid.png"} /> &nbsp;
                        &nbsp; History: {state.history.length - 1}{" "}
                        {state.history.length > 0 && (
                            <button onClick={rollback} style={{ marginLeft: 20, heigth: 40 }}>
                                Back
                            </button>
                        )}
                    </div>
                )}
            </div>
            {range(Gobang.ROW_COUNT).map((row) => (
                <Row
                    squares={Gobang.getRow(state.history[0][0], row)}
                    row={row}
                    key={"row" + row}
                    handleClick={handleClick}
                />
            ))}
        </div>
    );
}
