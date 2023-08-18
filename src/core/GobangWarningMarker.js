import GobangUtils from "./GobangUtils";

const WARNING_PATTERNS = [
    // 3 in line
    // OXXXO
    {
        stoneIndexes: [0, 1, 2],
        emptyIndexes: [-1, 3]
    },
    {
        stoneIndexes: [-1, 0, 1],
        emptyIndexes: [-2, 2]
    },
    {
        stoneIndexes: [-2, -1, 0],
        emptyIndexes: [-3, 1]
    },
    // OXOXXO
    {
        stoneIndexes: [0, 2, 3],
        emptyIndexes: [-1, 1, 4]
    },
    {
        stoneIndexes: [-2, 0, 1],
        emptyIndexes: [-3, -1, 2]
    },
    {
        stoneIndexes: [-3, -1, 0],
        emptyIndexes: [-4, -2, 1]
    },
    // OXXOXO
    {
        stoneIndexes: [0, 1, 3],
        emptyIndexes: [-1, 2, 4]
    },
    {
        stoneIndexes: [-1, 0, 2],
        emptyIndexes: [-2, 1, 3]
    },
    {
        stoneIndexes: [-3, -2, 0],
        emptyIndexes: [-4, -1, 1]
    },

    // 4 in line
    // OXXXX
    {
        stoneIndexes: [0, 1, 2, 3],
        emptyIndexes: [-1]
    },
    {
        stoneIndexes: [-1, 0, 1, 2],
        emptyIndexes: [-2]
    },
    {
        stoneIndexes: [-2, -1, 0, 1],
        emptyIndexes: [-3]
    },
    {
        stoneIndexes: [-3, -2, -1, 0],
        emptyIndexes: [-4]
    },
    // XOXXX
    {
        stoneIndexes: [0, 2, 3, 4],
        emptyIndexes: [1]
    },
    {
        stoneIndexes: [-2, 0, 1, 2],
        emptyIndexes: [-1],
        warningIndexes: [-1]
    },
    {
        stoneIndexes: [-3, -1, 0, 1],
        emptyIndexes: [-2]
    },
    {
        stoneIndexes: [-4, -2, -1, 0],
        emptyIndexes: [-3]
    },
    // XXOXX
    {
        stoneIndexes: [0, 1, 3, 4],
        emptyIndexes: [2]
    },
    {
        stoneIndexes: [-1, 0, 2, 3],
        emptyIndexes: [1],
        warningIndexes: [1]
    },
    {
        stoneIndexes: [-3, -2, 0, 1],
        emptyIndexes: [-1]
    },
    {
        stoneIndexes: [-4, -3, -1, 0],
        emptyIndexes: [-2]
    },
    // XXXOX
    {
        stoneIndexes: [0, 1, 2, 4],
        emptyIndexes: [3]
    },
    {
        stoneIndexes: [-1, 0, 1, 3],
        emptyIndexes: [2],
        warningIndexes: [2]
    },
    {
        stoneIndexes: [-2, -1, 0, 2],
        emptyIndexes: [1]
    },
    {
        stoneIndexes: [-4, -3, -2, 0],
        emptyIndexes: [-1]
    },
    // XXXXO
    {
        stoneIndexes: [0, 1, 2, 3],
        emptyIndexes: [4]
    },
    {
        stoneIndexes: [-1, 0, 1, 2],
        emptyIndexes: [3]
    },
    {
        stoneIndexes: [-2, -1, 0, 1],
        emptyIndexes: [2]
    },
    {
        stoneIndexes: [-3, -2, -1, 0],
        emptyIndexes: [1]
    }
];

export default function markWarnings(squares, currentCoordinate) {
    GobangUtils.COORDINATE_CALCULATORS.forEach((coordinateCalculate) =>
        checkAndShowWarningsInLine(squares, currentCoordinate, coordinateCalculate, WARNING_PATTERNS)
    );
}

function checkAndShowWarningsInLine(squares, currentCoordinate, coordinateCalculate, patterns) {
    function getNth(n) {
        return GobangUtils.getNthSquareInLine(squares, currentCoordinate, n, coordinateCalculate);
    }

    function emptySquaresMatchPattern(indexPattern) {
        for (let i = 0; i < indexPattern.length; i++) {
            if (!getNth(indexPattern[i]).isEmpty()) return false;
        }
        return true;
    }

    function markWarningsInLine(stoneIndexes) {
        stoneIndexes.forEach((i) => {
            if (stoneIndexes.length === 3) getNth(i).setInOpen3();
            else getNth(i).setInOpen4();
        });
    }

    for (let i = 0; i < patterns.length; i++) {
        if (
            GobangUtils.stonesMatchPattern(patterns[i].stoneIndexes, getNth) &&
            emptySquaresMatchPattern(patterns[i].emptyIndexes)
        ) {
            markWarningsInLine(patterns[i].stoneIndexes);
        }
    }
}
