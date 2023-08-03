import Gobang from "./Gobang";

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

export function markWarnings(squares, currentCoordinate) {
    Gobang.COORDINATE_CALCULATORS.forEach((coordinateCalculate) =>
        checkAndShowWarningsInLine(squares, currentCoordinate, coordinateCalculate, WARNING_PATTERNS)
    );
}

function checkAndShowWarningsInLine(squares, currentCoordinate, coordinateCalculate, patterns) {
    function getNth(n) {
        return Gobang.getNthSquareInLine(squares, currentCoordinate, n, coordinateCalculate);
    }

    function emptySquaresMatchPattern(indexPattern) {
        for (let i = 0; i < indexPattern.length; i++) {
            if (!getNth(indexPattern[i]).isEmpty()) return false;
        }
        return true;
    }

    function markWarningsInLine(playerIndexes) {
        playerIndexes.forEach((i) => {
            if (playerIndexes.length === 3) getNth(i).setInOpen3();
            else getNth(i).setInOpen4();
        });
    }

    for (let i = 0; i < patterns.length; i++) {
        if (
            Gobang.playerMarkersMatchPattern(patterns[i].playerIndexes, getNth) &&
            emptySquaresMatchPattern(patterns[i].emptyIndexes)
        ) {
            markWarningsInLine(patterns[i].playerIndexes);
        }
    }
}
