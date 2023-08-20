import { stonesMatchPattern } from "./Gobang";
import Gobang from "./Gobang";
import GameBase from "./GameBase";

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

// return the all the coordinates that could fix one of the 4-in-lines formed by current stone
export default function markWarnings(squares, currentCoordinate) {
    const coordinatesToFixFourInLine = [];
    GameBase.COORDINATE_CALCULATORS.forEach((coordinateCalculate) => {
        const fixCoordinates = checkAndShowWarningsInLine(
            squares,
            currentCoordinate,
            coordinateCalculate,
            WARNING_PATTERNS
        );
        fixCoordinates.forEach((c) => coordinatesToFixFourInLine.push(c));
    });
    return coordinatesToFixFourInLine;
}

// return the coordinates which could fix the 4-in-line formed by current stone
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

    const coordinatesToFixFourInLine = [];
    for (let i = 0; i < patterns.length; i++) {
        const stoneIndexes = patterns[i].stoneIndexes;
        const emptyIndexes = patterns[i].emptyIndexes;
        if (stonesMatchPattern(stoneIndexes, getNth) && emptySquaresMatchPattern(emptyIndexes)) {
            stoneIndexes.forEach((stoneIndexes) => getNth(stoneIndexes).setBlink());
            if (stoneIndexes.length === 4) {
                emptyIndexes.forEach((emptyIndex) =>
                    coordinatesToFixFourInLine.push(coordinateCalculate(currentCoordinate, emptyIndex))
                );
            }
        }
    }
    return coordinatesToFixFourInLine;
}
