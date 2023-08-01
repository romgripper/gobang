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

    function handleClick(index) {
        if (winner || squares[index].isMarkedByPlayer()) {
            return;
        }
        const nextSquares = squares.map((square) => square.clone());
        Gobang.clearWarnings(nextSquares);

        nextSquares[index] = nextSquare;

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
                {(winner ? "Winner: " + squares[latestMove].getPlayer() : "Next player: " + nextSquare.getPlayer()) +
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
                    squares={squares}
                    startIndex={row * Gobang.COLUMN_COUNT}
                    key={"row" + row}
                    columnCount={Gobang.COLUMN_COUNT}
                    handleClick={handleClick}
                />
            ))}
        </>
    );
}
