import { useState } from "react";

import Row from "./Row";
import { PlayerSquare, getPlayer } from "./SquareData";
import {
    INITIAL_SQAURES,
    ROW_COUNT,
    COLUMN_COUNT,
    VIRTUAL_COLUMN_COUNT,
    calculateWinner,
    markWarnings,
    clearWarnings
} from "./Gobang";

const MAX_HISTORY_COUNT = 9;

function range(size) {
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(i);
    }
    return a;
}

export default function Board() {
    const [isNextBlack, setNextBlack] = useState(true);
    const [squares, setSquares] = useState(INITIAL_SQAURES);
    const [latestMove, setLatestMove] = useState(null);
    const [winner, setWinner] = useState(null);
    const [history, setHistory] = useState([]);

    function takeTurn() {
        setNextBlack(!isNextBlack);
    }

    function handleClick(index) {
        if (winner || squares[index].isMarkedByPlayer()) {
            return;
        }
        const nextSquares = squares.map((square) => square.clone());
        clearWarnings(nextSquares);

        nextSquares[index] = new PlayerSquare(isNextBlack);
        nextSquares[index].setLatestMove(true);

        if (latestMove) {
            nextSquares[latestMove].setLatestMove(false);
        }
        setSquares(nextSquares);
        setLatestMove(index);

        const currentWinner = calculateWinner(nextSquares, index);
        setWinner(currentWinner);
        if (currentWinner) {
            return;
        }
        markWarnings(nextSquares, index);
        history.unshift([squares, latestMove]);
        if (history.length > MAX_HISTORY_COUNT) {
            history.pop();
        }
        setHistory(history);
        takeTurn();
    }

    function rollbackStep() {
        if (history.length > 0) {
            const [lastSquares, lastMove] = history.shift();
            setLatestMove(lastMove);
            setSquares(lastSquares);
            setHistory(history);
            takeTurn();
        }
    }

    return (
        <>
            <div className="status">
                {(winner ? "Winner: " + getPlayer(winner.isBlack) : "Next player: " + getPlayer(isNextBlack)) +
                    "; History: " +
                    history.length}

                {!winner && (
                    <button onClick={rollbackStep} style={{ marginLeft: 20 }}>
                        Back
                    </button>
                )}
            </div>
            {range(ROW_COUNT).map((row) => (
                <Row
                    squares={squares}
                    startIndex={row * VIRTUAL_COLUMN_COUNT}
                    key={"row" + row}
                    columnCount={COLUMN_COUNT}
                    handleClick={handleClick}
                />
            ))}
        </>
    );
}
