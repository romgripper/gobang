import { stonesMatchPattern } from "./Gobang";
import Gobang from "./Gobang";
import Game from "./Game";

const WARNING_PATTERNS = [
    // 3 in line
    // OXXXO
    {
        stoneIndexes: [0, 1, 2],
        noStoneIndexes: [-1, 3]
    },
    {
        stoneIndexes: [-1, 0, 1],
        noStoneIndexes: [-2, 2]
    },
    {
        stoneIndexes: [-2, -1, 0],
        noStoneIndexes: [-3, 1]
    },
    // OXOXXO
    {
        stoneIndexes: [0, 2, 3],
        noStoneIndexes: [-1, 1, 4]
    },
    {
        stoneIndexes: [-2, 0, 1],
        noStoneIndexes: [-3, -1, 2]
    },
    {
        stoneIndexes: [-3, -1, 0],
        noStoneIndexes: [-4, -2, 1]
    },
    // OXXOXO
    {
        stoneIndexes: [0, 1, 3],
        noStoneIndexes: [-1, 2, 4]
    },
    {
        stoneIndexes: [-1, 0, 2],
        noStoneIndexes: [-2, 1, 3]
    },
    {
        stoneIndexes: [-3, -2, 0],
        noStoneIndexes: [-4, -1, 1]
    },

    // 4 in line
    // OXXXX
    {
        stoneIndexes: [0, 1, 2, 3],
        noStoneIndexes: [-1]
    },
    {
        stoneIndexes: [-1, 0, 1, 2],
        noStoneIndexes: [-2]
    },
    {
        stoneIndexes: [-2, -1, 0, 1],
        noStoneIndexes: [-3]
    },
    {
        stoneIndexes: [-3, -2, -1, 0],
        noStoneIndexes: [-4]
    },
    // XOXXX
    {
        stoneIndexes: [0, 2, 3, 4],
        noStoneIndexes: [1]
    },
    {
        stoneIndexes: [-2, 0, 1, 2],
        noStoneIndexes: [-1],
        warningIndexes: [-1]
    },
    {
        stoneIndexes: [-3, -1, 0, 1],
        noStoneIndexes: [-2]
    },
    {
        stoneIndexes: [-4, -2, -1, 0],
        noStoneIndexes: [-3]
    },
    // XXOXX
    {
        stoneIndexes: [0, 1, 3, 4],
        noStoneIndexes: [2]
    },
    {
        stoneIndexes: [-1, 0, 2, 3],
        noStoneIndexes: [1],
        warningIndexes: [1]
    },
    {
        stoneIndexes: [-3, -2, 0, 1],
        noStoneIndexes: [-1]
    },
    {
        stoneIndexes: [-4, -3, -1, 0],
        noStoneIndexes: [-2]
    },
    // XXXOX
    {
        stoneIndexes: [0, 1, 2, 4],
        noStoneIndexes: [3]
    },
    {
        stoneIndexes: [-1, 0, 1, 3],
        noStoneIndexes: [2],
        warningIndexes: [2]
    },
    {
        stoneIndexes: [-2, -1, 0, 2],
        noStoneIndexes: [1]
    },
    {
        stoneIndexes: [-4, -3, -2, 0],
        noStoneIndexes: [-1]
    },
    // XXXXO
    {
        stoneIndexes: [0, 1, 2, 3],
        noStoneIndexes: [4]
    },
    {
        stoneIndexes: [-1, 0, 1, 2],
        noStoneIndexes: [3]
    },
    {
        stoneIndexes: [-2, -1, 0, 1],
        noStoneIndexes: [2]
    },
    {
        stoneIndexes: [-3, -2, -1, 0],
        noStoneIndexes: [1]
    }
];

// return the all the coordinates that could fix one of the 4-in-lines formed by current stone
export default function markWarnings(stones, currentCoordinate) {
    const coordinatesToFixFourInLine = [];
    Game.COORDINATE_CALCULATORS.forEach((coordinateCalculate) => {
        const fixCoordinates = checkAndShowWarningsInLine(
            stones,
            currentCoordinate,
            coordinateCalculate,
            WARNING_PATTERNS
        );
        fixCoordinates.forEach((c) => coordinatesToFixFourInLine.push(c));
    });
    return coordinatesToFixFourInLine;
}

// return the coordinates which could fix the 4-in-line formed by current stone
function checkAndShowWarningsInLine(stones, currentCoordinate, coordinateCalculate, patterns) {
    function getNth(n) {
        return Gobang.getNthStoneInLine(stones, currentCoordinate, n, coordinateCalculate);
    }

    function noStonesMatchPattern(indexPattern) {
        for (let i = 0; i < indexPattern.length; i++) {
            if (!getNth(indexPattern[i]).isNoStone()) return false;
        }
        return true;
    }

    const coordinatesToFixFourInLine = [];
    for (let i = 0; i < patterns.length; i++) {
        const stoneIndexes = patterns[i].stoneIndexes;
        const noStoneIndexes = patterns[i].noStoneIndexes;
        if (stonesMatchPattern(stoneIndexes, getNth) && noStonesMatchPattern(noStoneIndexes)) {
            stoneIndexes.forEach((stoneIndexes) => getNth(stoneIndexes).setBlink());
            if (stoneIndexes.length === 4) {
                noStoneIndexes.forEach((emptyIndex) =>
                    coordinatesToFixFourInLine.push(coordinateCalculate(currentCoordinate, emptyIndex))
                );
            }
        }
    }
    return coordinatesToFixFourInLine;
}
