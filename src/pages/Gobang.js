import { EmptySquare, VirtualSquare } from "./SquareData";

const ROW_COUNT = 19;
const COLUMN_COUNT = 19;

const INITIAL_SQAURES = Array(ROW_COUNT * COLUMN_COUNT)
    .fill(null)
    .map(() => new EmptySquare());

const INDEX_CALCULATORS = [
    (current, n) => current + n, // row
    (current, n) => current + n * COLUMN_COUNT, // column
    (current, n) => current + n * (COLUMN_COUNT + 1), // diagonal 1
    (current, n) => current + n * (COLUMN_COUNT - 1) // diagonal 2
];

// current move's index is 0,
// 5 possible positions for current move
const WINNING_PATTERNS = [
    [0, 1, 2, 3, 4],
    [-1, 0, 1, 2, 3],
    [-2, -1, 0, 1, 2],
    [-3, -2, -1, 0, 1],
    [-4, -3, -2, -1, 0]
];

const WARNING_PATTERNS = [
    // 3 in line
    // OXXXO
    {
        playerIndexes: [0, 1, 2],
        emptyIndexes: [-1, 3]
    },
    {
        playerIndexes: [-1, 0, 1],
        emptyIndexes: [-2, 2]
    },
    {
        playerIndexes: [-2, -1, 0],
        emptyIndexes: [-3, 1]
    },
    // OXOXXO
    {
        playerIndexes: [0, 2, 3],
        emptyIndexes: [-1, 1, 4]
    },
    {
        playerIndexes: [-2, 0, 1],
        emptyIndexes: [-3, -1, 2]
    },
    {
        playerIndexes: [-3, -1, 0],
        emptyIndexes: [-4, -2, 1]
    },
    // OXXOXO
    {
        playerIndexes: [0, 1, 3],
        emptyIndexes: [-1, 2, 4]
    },
    {
        playerIndexes: [-1, 0, 2],
        emptyIndexes: [-2, 1, 3]
    },
    {
        playerIndexes: [-3, -2, 0],
        emptyIndexes: [-4, -1, 1]
    },

    // 4 in line
    // OXXXX
    {
        playerIndexes: [0, 1, 2, 3],
        emptyIndexes: [-1]
    },
    {
        playerIndexes: [-1, 0, 1, 2],
        emptyIndexes: [-2]
    },
    {
        playerIndexes: [-2, -1, 0, 1],
        emptyIndexes: [-3]
    },
    {
        playerIndexes: [-3, -2, -1, 0],
        emptyIndexes: [-4]
    },
    // XOXXX
    {
        playerIndexes: [0, 2, 3, 4],
        emptyIndexes: [1]
    },
    {
        playerIndexes: [-2, 0, 1, 2],
        emptyIndexes: [-1],
        warningIndexes: [-1]
    },
    {
        playerIndexes: [-3, -1, 0, 1],
        emptyIndexes: [-2]
    },
    {
        playerIndexes: [-4, -2, -1, 0],
        emptyIndexes: [-3]
    },
    // XXOXX
    {
        playerIndexes: [0, 1, 3, 4],
        emptyIndexes: [2]
    },
    {
        playerIndexes: [-1, 0, 2, 3],
        emptyIndexes: [1],
        warningIndexes: [1]
    },
    {
        playerIndexes: [-3, -2, 0, 1],
        emptyIndexes: [-1]
    },
    {
        playerIndexes: [-4, -3, -1, 0],
        emptyIndexes: [-2]
    },
    // XXXOX
    {
        playerIndexes: [0, 1, 2, 4],
        emptyIndexes: [3]
    },
    {
        playerIndexes: [-1, 0, 1, 3],
        emptyIndexes: [2],
        warningIndexes: [2]
    },
    {
        playerIndexes: [-2, -1, 0, 2],
        emptyIndexes: [1]
    },
    {
        playerIndexes: [-4, -3, -2, 0],
        emptyIndexes: [-1]
    },
    // XXXXO
    {
        playerIndexes: [0, 1, 2, 3],
        emptyIndexes: [4]
    },
    {
        playerIndexes: [-1, 0, 1, 2],
        emptyIndexes: [3]
    },
    {
        playerIndexes: [-2, -1, 0, 1],
        emptyIndexes: [2]
    },
    {
        playerIndexes: [-3, -2, -1, 0],
        emptyIndexes: [1]
    }
];

function calculateWinner(squares, latestMove) {
    for (let i = 0; i < INDEX_CALCULATORS.length; i++) {
        const winning = check5Inline(squares, latestMove, INDEX_CALCULATORS[i]);
        if (winning) {
            return squares[latestMove];
        }
    }
    return null;
}

function check5Inline(squares, currentIndex, indexCalculate) {
    function getNth(n) {
        return getNthInLine(squares, currentIndex, n, indexCalculate);
    }

    function mark5InLine(indexPattern) {
        for (let i = 0; i < indexPattern.length; i++) {
            getNth(indexPattern[i]).setIn5();
        }
        return true;
    }

    for (let i = 0; i < WINNING_PATTERNS.length; i++) {
        if (playerMarkersMatchPattern(WINNING_PATTERNS[i], getNth)) {
            mark5InLine(WINNING_PATTERNS[i]);
            return true;
        }
    }
    return false;
}

function getNthInLine(squares, currentIndex, n, indexCalculate) {
    const [row, column] = getCoordinate(indexCalculate(currentIndex, n));
    return isOutOfBoard(row, column)
        ? new VirtualSquare() // virtual
        : squares[indexCalculate(currentIndex, n)];
}

function getCoordinate(index) {
    return [Math.floor(index / COLUMN_COUNT), index % COLUMN_COUNT];
}

function isOutOfBoard(row, column) {
    return row < 0 || row >= ROW_COUNT || column < 0 || column >= COLUMN_COUNT;
}

function playerMarkersMatchPattern(indexPattern, getNth) {
    const first = getNth(indexPattern[0]);
    for (let i = 1; i < indexPattern.length; i++) {
        if (!playerSquareAndEquals(first, getNth(indexPattern[i]))) return false;
    }
    return true;
}

function playerSquareAndEquals(square1, square2) {
    return square1.isMarkedByPlayer() && square2.isMarkedByPlayer() && square1.isBlack() === square2.isBlack();
}

function clearWarnings(squares) {
    for (let i = 0; i < ROW_COUNT; i++) {
        for (let j = 0; j < COLUMN_COUNT; j++) {
            if (!squares[getIndex(i, j)].setShowWarning) {
                console.log([i, j], squares[getIndex(i, j)]);
            }
            squares[getIndex(i, j)].setShowWarning(false);
        }
    }
}

function getIndex(row, column) {
    return row * COLUMN_COUNT + column;
}

function markWarnings(squares, latestMove) {
    INDEX_CALCULATORS.forEach((indexCalculator) =>
        checkAndShowWarningsInLine(squares, latestMove, indexCalculator, WARNING_PATTERNS)
    );
}

function checkAndShowWarningsInLine(squares, currentIndex, indexCalculate, patterns) {
    function getNth(n) {
        return getNthInLine(squares, currentIndex, n, indexCalculate);
    }

    function emptySquaresMatchPattern(indexPattern) {
        for (let i = 0; i < indexPattern.length; i++) {
            if (!getNth(indexPattern[i]).isEmpty()) return false;
        }
        return true;
    }

    function markWarningsInLine(warningIndexPattern) {
        for (let i = 0; i < warningIndexPattern.length; i++) {
            getNth(warningIndexPattern[i]).setShowWarning(true);
        }
    }

    for (let i = 0; i < patterns.length; i++) {
        if (
            playerMarkersMatchPattern(patterns[i].playerIndexes, getNth) &&
            emptySquaresMatchPattern(patterns[i].emptyIndexes)
        ) {
            markWarningsInLine(patterns[i].emptyIndexes);
        }
    }
}

const Gobang = {
    ROW_COUNT,
    COLUMN_COUNT,
    INITIAL_SQAURES,
    calculateWinner,
    clearWarnings,
    markWarnings
};

export default Gobang;
