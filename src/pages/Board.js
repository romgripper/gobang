import { useState } from "react";

import { Row } from "./Row";
import { PlayerSquare } from "./SquareData";
import Gobang from "./Gobang";
import calculateWinner from "./WinnerChecker";
import { markWarnings } from "./WarningMarker";

const MAX_HISTORY_COUNT = 9;

function createLatestMoveSquare(isBlack) {
    return new PlayerSquare(isBlack).setLatestMove(true);
}

const FIRST_PLAYER_SQUARE = createLatestMoveSquare(true);

function range(size) {
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(i);
    }
    return a;
}

const INITIAL_STATE = {
    nextSquare: FIRST_PLAYER_SQUARE,
    squares: Gobang.INITIAL_SQAURES,
    lastestMove: null,
    winner: null,
    history: []
};

export default function Board() {
    const [state, setState] = useState(INITIAL_STATE);

    function takeTurn(nextState) {
        nextState.nextSquare = createLatestMoveSquare(!state.nextSquare.isBlack());
    }

    function handleClick(coordinate) {
        if (state.winner || Gobang.getSquare(state.squares, coordinate).isMarkedByPlayer()) {
            return;
        }

        const nextState = {};

        nextState.squares = state.squares.map((row) => row.map((square) => square.clone()));

        Gobang.setSquare(nextState.squares, coordinate, state.nextSquare);
        nextState.latestMove = coordinate;

        nextState.winner = calculateWinner(nextState.squares, coordinate);
        if (!nextState.winner) {
            markWarnings(nextState.squares, coordinate);
        }
        updateHistory(nextState);
        takeTurn(nextState);
        setState(nextState);
    }

    function updateHistory(nextState) {
        nextState.history = state.history.slice();
        nextState.history.unshift([state.squares, state.latestMove]);
        if (nextState.history.length > MAX_HISTORY_COUNT) {
            nextState.history.pop();
        }
    }

    function rollback() {
        if (history.length > 0) {
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
                                Gobang.getSquare(state.squares, state.latestMove).isBlack()
                                    ? "/black-no-grid.png"
                                    : "/white-no-grid.png"
                            }
                        />
                    </div>
                )}
                {!state.winner && (
                    <div>
                        Next player:{" "}
                        <img src={state.nextSquare.isBlack() ? "/black-no-grid.png" : "/white-no-grid.png"} /> &nbsp;
                        &nbsp; History: {state.history.length}{" "}
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
                    squares={Gobang.getRow(state.squares, row)}
                    row={row}
                    key={"row" + row}
                    handleClick={handleClick}
                />
            ))}
        </div>
    );
}
