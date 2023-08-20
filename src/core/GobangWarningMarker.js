import GobangUtil from "./GobangUtil";
import Util from "./Util";

const WARNING_PATTERNS = [
    // 3 in line
    // OXXXO
    {
        stoneIndexes: [0, 1, 2],
        vacancyIndexes: [-1, 3]
    },
    {
        stoneIndexes: [-1, 0, 1],
        vacancyIndexes: [-2, 2]
    },
    {
        stoneIndexes: [-2, -1, 0],
        vacancyIndexes: [-3, 1]
    },
    // OXOXXO
    {
        stoneIndexes: [0, 2, 3],
        vacancyIndexes: [-1, 1, 4]
    },
    {
        stoneIndexes: [-2, 0, 1],
        vacancyIndexes: [-3, -1, 2]
    },
    {
        stoneIndexes: [-3, -1, 0],
        vacancyIndexes: [-4, -2, 1]
    },
    // OXXOXO
    {
        stoneIndexes: [0, 1, 3],
        vacancyIndexes: [-1, 2, 4]
    },
    {
        stoneIndexes: [-1, 0, 2],
        vacancyIndexes: [-2, 1, 3]
    },
    {
        stoneIndexes: [-3, -2, 0],
        vacancyIndexes: [-4, -1, 1]
    },

    // 4 in line
    // OXXXX
    {
        stoneIndexes: [0, 1, 2, 3],
        vacancyIndexes: [-1]
    },
    {
        stoneIndexes: [-1, 0, 1, 2],
        vacancyIndexes: [-2]
    },
    {
        stoneIndexes: [-2, -1, 0, 1],
        vacancyIndexes: [-3]
    },
    {
        stoneIndexes: [-3, -2, -1, 0],
        vacancyIndexes: [-4]
    },
    // XOXXX
    {
        stoneIndexes: [0, 2, 3, 4],
        vacancyIndexes: [1]
    },
    {
        stoneIndexes: [-2, 0, 1, 2],
        vacancyIndexes: [-1],
        warningIndexes: [-1]
    },
    {
        stoneIndexes: [-3, -1, 0, 1],
        vacancyIndexes: [-2]
    },
    {
        stoneIndexes: [-4, -2, -1, 0],
        vacancyIndexes: [-3]
    },
    // XXOXX
    {
        stoneIndexes: [0, 1, 3, 4],
        vacancyIndexes: [2]
    },
    {
        stoneIndexes: [-1, 0, 2, 3],
        vacancyIndexes: [1],
        warningIndexes: [1]
    },
    {
        stoneIndexes: [-3, -2, 0, 1],
        vacancyIndexes: [-1]
    },
    {
        stoneIndexes: [-4, -3, -1, 0],
        vacancyIndexes: [-2]
    },
    // XXXOX
    {
        stoneIndexes: [0, 1, 2, 4],
        vacancyIndexes: [3]
    },
    {
        stoneIndexes: [-1, 0, 1, 3],
        vacancyIndexes: [2],
        warningIndexes: [2]
    },
    {
        stoneIndexes: [-2, -1, 0, 2],
        vacancyIndexes: [1]
    },
    {
        stoneIndexes: [-4, -3, -2, 0],
        vacancyIndexes: [-1]
    },
    // XXXXO
    {
        stoneIndexes: [0, 1, 2, 3],
        vacancyIndexes: [4]
    },
    {
        stoneIndexes: [-1, 0, 1, 2],
        vacancyIndexes: [3]
    },
    {
        stoneIndexes: [-2, -1, 0, 1],
        vacancyIndexes: [2]
    },
    {
        stoneIndexes: [-3, -2, -1, 0],
        vacancyIndexes: [1]
    }
];

// return the all the coordinates that could fix one of the 4-in-lines formed by current stone
export default class GobangWarningMarker {
    #stones;
    #currentCoordinate;

    constructor(stones, currentCoordinate) {
        this.#stones = stones;
        this.#currentCoordinate = currentCoordinate;
    }

    markWarnings() {
        const coordinatesToFixFourInLine = [];
        Util.COORDINATE_CALCULATORS.forEach((coordinateCalculate) => {
            const fixCoordinates = this.#checkAndShowWarningsInLine(coordinateCalculate, WARNING_PATTERNS);
            fixCoordinates.forEach((c) => coordinatesToFixFourInLine.push(c));
        });
        return coordinatesToFixFourInLine;
    }

    // return the coordinates which could fix the 4-in-line formed by current stone
    #checkAndShowWarningsInLine(coordinateCalculate, patterns) {
        const getNth = (n) =>
            GobangUtil.getNthStoneInLine(this.#stones, this.#currentCoordinate, n, coordinateCalculate);

        function vacanciesMatchPattern(indexPattern) {
            for (let i = 0; i < indexPattern.length; i++) {
                if (!getNth(indexPattern[i]).isVacancy()) return false;
            }
            return true;
        }

        const coordinatesToFixFourInLine = [];
        for (let i = 0; i < patterns.length; i++) {
            const stoneIndexes = patterns[i].stoneIndexes;
            const vacancyIndexes = patterns[i].vacancyIndexes;
            if (GobangUtil.stonesMatchPattern(stoneIndexes, getNth) && vacanciesMatchPattern(vacancyIndexes)) {
                stoneIndexes.forEach((stoneIndexes) => getNth(stoneIndexes).setBlink());
                if (stoneIndexes.length === 4) {
                    vacancyIndexes.forEach((vacancyIndex) =>
                        coordinatesToFixFourInLine.push(coordinateCalculate(this.#currentCoordinate, vacancyIndex))
                    );
                }
            }
        }
        return coordinatesToFixFourInLine;
    }
}
