import { EmptySquare, VirtualSquare } from "./SquareData";

const ROW_COUNT = 19;
const COLUMN_COUNT = 19;

const VIRTUAL_ROW_COUNT = ROW_COUNT + 4;
const VIRTUAL_COLUMN_COUNT = COLUMN_COUNT + 4;

const INDEX_CALCULATORS = [
    (current, n) => current + n,
    (current, n) => current + n * VIRTUAL_COLUMN_COUNT,
    (current, n) => current + n * (VIRTUAL_COLUMN_COUNT + 1),
    (current, n) => current + n * (VIRTUAL_COLUMN_COUNT - 1)
];

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

function getIndex(row, col) {
    return row * VIRTUAL_COLUMN_COUNT + col;
}

function getCoordinate(index) {
    return [Math.floor(index / VIRTUAL_COLUMN_COUNT), index % VIRTUAL_COLUMN_COUNT];
}

const INITIAL_SQAURES = Array(VIRTUAL_ROW_COUNT * VIRTUAL_COLUMN_COUNT);

for (let i = 0; i < VIRTUAL_ROW_COUNT; i++) {
    for (let j = 0; j < VIRTUAL_COLUMN_COUNT; j++) {
        INITIAL_SQAURES[getIndex(i, j)] = isOutOfBoard(i, j) ? new VirtualSquare() : new EmptySquare();
    }
}

function isOutOfBoard(row, column) {
    return row < 0 || row >= ROW_COUNT || column < 0 || column >= COLUMN_COUNT;
}

function check5Inline(squares, currentIndex, indexCalculate) {
    function getNthInLine(n) {
        const [row, column] = getCoordinate(indexCalculate(currentIndex, n));
        return isOutOfBoard(row, column)
            ? new VirtualSquare() // virtual
            : squares[indexCalculate(currentIndex, n)];
    }

    function playerMarkersMatchPattern(indexPattern) {
        const first = getNthInLine(indexPattern[0]);
        for (let i = 1; i < indexPattern.length; i++) {
            if (!playerSquareAndEquals(first, getNthInLine(indexPattern[i]))) return false;
        }
        return true;
    }

    function mark5InLine(indexPattern) {
        for (let i = 0; i < indexPattern.length; i++) {
            getNthInLine(indexPattern[i]).setIn5();
        }
        return true;
    }

    for (let i = 0; i < WINNING_PATTERNS.length; i++) {
        if (playerMarkersMatchPattern(WINNING_PATTERNS[i])) {
            mark5InLine(WINNING_PATTERNS[i]);
            return true;
        }
    }
    return false;
}

function playerSquareAndEquals(square1, square2) {
    return square1.isMarkedByPlayer() && square2.isMarkedByPlayer() && square1.isBlack() === square2.isBlack();
}

function calculateWinner(squares, latestMove) {
    for (let i = 0; i < INDEX_CALCULATORS.length; i++) {
        const winning = check5Inline(squares, latestMove, INDEX_CALCULATORS[i]);
        if (winning) {
            return squares[latestMove];
        }
    }
    return null;
}

function checkAndShowWarningsInLine(squares, currentIndex, indexCalculate, patterns) {
    function getNthInLine(n) {
        const [row, column] = getCoordinate(indexCalculate(currentIndex, n));
        return isOutOfBoard(row, column)
            ? new VirtualSquare() // virtual
            : squares[indexCalculate(currentIndex, n)];
    }

    function playerMarkersMatchPattern(indexPattern) {
        const first = getNthInLine(indexPattern[0]);
        for (let i = 1; i < indexPattern.length; i++) {
            if (!playerSquareAndEquals(first, getNthInLine(indexPattern[i]))) return false;
        }
        return true;
    }

    function emptySquaresMatchPattern(indexPattern) {
        for (let i = 0; i < indexPattern.length; i++) {
            if (!getNthInLine(indexPattern[i]).isEmpty()) return false;
        }
        return true;
    }

    function markWarningsInLine(warningIndexPattern) {
        for (let i = 0; i < warningIndexPattern.length; i++) {
            getNthInLine(warningIndexPattern[i]).setShowWarning(true);
        }
    }

    for (let i = 0; i < patterns.length; i++) {
        if (
            playerMarkersMatchPattern(patterns[i].playerIndexes) &&
            emptySquaresMatchPattern(patterns[i].emptyIndexes)
        ) {
            markWarningsInLine(patterns[i].emptyIndexes);
        }
    }
}

function clearWarnings(squares) {
    for (let i = 0; i < ROW_COUNT; i++) {
        for (let j = 0; j < COLUMN_COUNT; j++) {
            let current = getIndex(i, j);
            if (squares[current].showWarning()) {
                squares[current].setShowWarning(false);
            }
        }
    }
}

function markWarnings(squares, latestMove) {
    INDEX_CALCULATORS.forEach((indexCalculator) =>
        checkAndShowWarningsInLine(squares, latestMove, indexCalculator, WARNING_PATTERNS)
    );
}

const Gobang = {
    ROW_COUNT,
    COLUMN_COUNT,
    VIRTUAL_ROW_COUNT,
    VIRTUAL_COLUMN_COUNT,
    INITIAL_SQAURES,
    calculateWinner,
    clearWarnings,
    markWarnings
};

export default Gobang;
