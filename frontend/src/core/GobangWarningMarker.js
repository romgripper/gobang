import Line from "./Line";

const WARNING_PATTERNS = [
    // 3 in line
    // OXXXO
    {
        stonePattern: [0, 1, 2],
        vacancyPattern: [-1, 3]
    },
    {
        stonePattern: [-1, 0, 1],
        vacancyPattern: [-2, 2]
    },
    {
        stonePattern: [-2, -1, 0],
        vacancyPattern: [-3, 1]
    },
    // OXOXXO
    {
        stonePattern: [0, 2, 3],
        vacancyPattern: [-1, 1, 4]
    },
    {
        stonePattern: [-2, 0, 1],
        vacancyPattern: [-3, -1, 2]
    },
    {
        stonePattern: [-3, -1, 0],
        vacancyPattern: [-4, -2, 1]
    },
    // OXXOXO
    {
        stonePattern: [0, 1, 3],
        vacancyPattern: [-1, 2, 4]
    },
    {
        stonePattern: [-1, 0, 2],
        vacancyPattern: [-2, 1, 3]
    },
    {
        stonePattern: [-3, -2, 0],
        vacancyPattern: [-4, -1, 1]
    },

    // 4 in line
    // OXXXX
    {
        stonePattern: [0, 1, 2, 3],
        vacancyPattern: [-1]
    },
    {
        stonePattern: [-1, 0, 1, 2],
        vacancyPattern: [-2]
    },
    {
        stonePattern: [-2, -1, 0, 1],
        vacancyPattern: [-3]
    },
    {
        stonePattern: [-3, -2, -1, 0],
        vacancyPattern: [-4]
    },
    // XOXXX
    {
        stonePattern: [0, 2, 3, 4],
        vacancyPattern: [1]
    },
    {
        stonePattern: [-2, 0, 1, 2],
        vacancyPattern: [-1],
        warningIndexes: [-1]
    },
    {
        stonePattern: [-3, -1, 0, 1],
        vacancyPattern: [-2]
    },
    {
        stonePattern: [-4, -2, -1, 0],
        vacancyPattern: [-3]
    },
    // XXOXX
    {
        stonePattern: [0, 1, 3, 4],
        vacancyPattern: [2]
    },
    {
        stonePattern: [-1, 0, 2, 3],
        vacancyPattern: [1],
        warningIndexes: [1]
    },
    {
        stonePattern: [-3, -2, 0, 1],
        vacancyPattern: [-1]
    },
    {
        stonePattern: [-4, -3, -1, 0],
        vacancyPattern: [-2]
    },
    // XXXOX
    {
        stonePattern: [0, 1, 2, 4],
        vacancyPattern: [3]
    },
    {
        stonePattern: [-1, 0, 1, 3],
        vacancyPattern: [2],
        warningIndexes: [2]
    },
    {
        stonePattern: [-2, -1, 0, 2],
        vacancyPattern: [1]
    },
    {
        stonePattern: [-4, -3, -2, 0],
        vacancyPattern: [-1]
    },
    // XXXXO
    {
        stonePattern: [0, 1, 2, 3],
        vacancyPattern: [4]
    },
    {
        stonePattern: [-1, 0, 1, 2],
        vacancyPattern: [3]
    },
    {
        stonePattern: [-2, -1, 0, 1],
        vacancyPattern: [2]
    },
    {
        stonePattern: [-3, -2, -1, 0],
        vacancyPattern: [1]
    }
];

// return the all the coordinates that could fix one of the 4-in-lines formed by current stone
export default class GobangWarningMarker {
    #board;
    #latestMove;

    constructor(board, latestMove) {
        this.#board = board;
        this.#latestMove = latestMove;
    }

    // mark 3-in-lines or 4-in-lines caused by latest stone and return coordinates that would block 4-in-lines to become 5-in-lines
    markWarnings() {
        const coordinatesToFix4InLine = [];
        Line.LINES.forEach((line) => {
            const fixCoordinates = this.#checkAndShowWarningsInLine(line, WARNING_PATTERNS);
            fixCoordinates.forEach((c) => coordinatesToFix4InLine.push(c));
        });
        return coordinatesToFix4InLine;
    }

    // return the coordinates which could fix the 4-in-line formed by current stone
    #checkAndShowWarningsInLine(line, patterns) {
        const stonesInLine = new Line(this.#board, this.#latestMove, line);

        const coordinatesToFix4InLine = [];
        for (let i = 0; i < patterns.length; i++) {
            const stonePattern = patterns[i].stonePattern;
            const vacancyPattern = patterns[i].vacancyPattern;
            if (stonesInLine.stonesMatchPattern(stonePattern) && stonesInLine.vacanciesMatchPattern(vacancyPattern)) {
                stonePattern.forEach((index) => stonesInLine.getNth(index).setBlink());
                if (stonePattern.length === 4) {
                    vacancyPattern.forEach((vacancyIndex) =>
                        coordinatesToFix4InLine.push(stonesInLine.getNthCoordinate(vacancyIndex))
                    );
                }
            }
        }
        return coordinatesToFix4InLine;
    }
}
