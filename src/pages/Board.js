import { useState } from "react";

import Row from "./Row";
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

export default function Board() {
    const [nextSquare, setNextSquare] = useState(new PlayerSquare(true, false, true)); // black and last move
    const [squares, setSquares] = useState(Gobang.INITIAL_SQAURES);
    const [latestMove, setLatestMove] = useState(null);
    const [winner, setWinner] = useState(null);
    const [history, setHistory] = useState([]);

    function takeTurn() {
        setNextSquare(new PlayerSquare(!nextSquare.isBlack(), false, true));
    }

    function handleClick(coordinate) {
        if (winner || Gobang.getSquare(squares, coordinate).isMarkedByPlayer()) {
            return;
        }
        const nextSquares = squares.slice();
        Gobang.clearWarnings(nextSquares);

        Gobang.setSquare(nextSquares, coordinate, nextSquare);

        if (latestMove) {
            Gobang.getSquare(nextSquares, latestMove).setLatestMove(false);
        }
        setSquares(nextSquares);
        setLatestMove(coordinate);

        const currentWinner = calculateWinner(nextSquares, coordinate);
        setWinner(currentWinner);
        if (currentWinner) {
            return;
        }
        markWarnings(nextSquares, coordinate);
        updateHistory();
        takeTurn();
    }

    function updateHistory() {
        const nextHistory = history.slice();
        nextHistory.unshift([squares, latestMove]);
        if (nextHistory.length > MAX_HISTORY_COUNT) {
            nextHistory.pop();
        }
        setHistory(nextHistory);
    }

    function rollbackStep() {
        if (history.length > 0) {
            const nextHistory = history.slice();
            const [lastSquares, lastMove] = nextHistory.shift();
            setLatestMove(lastMove);
            setSquares(lastSquares);
            setHistory(nextHistory);
            takeTurn();
        }
    }

    return (
        <div className="center">
            <div className="status">
                {(winner
                    ? "Winner: " + Gobang.getSquare(squares, latestMove).getPlayer()
                    : "Next player: " + nextSquare.getPlayer()) +
                    "; History: " +
                    history.length}

                {!winner && (
                    <button onClick={rollbackStep} style={{ marginLeft: 20 }}>
                        Back
                    </button>
                )}
            </div>
            {range(Gobang.ROW_COUNT).map((row) => (
                <Row
                    squares={Gobang.getRow(squares, row)}
                    row={row}
                    key={"row" + row}
                    columnCount={Gobang.COLUMN_COUNT}
                    handleClick={handleClick}
                />
            ))}
        </div>
    );
}
