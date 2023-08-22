import Game from "./Game";

export default class Go extends Game {
    constructor() {
        super(19, 19);
    }

    createInitialState() {
        return {
            isNextBlack: true,
            hasWinner: false,
            board: this.createInitialBoard()
        };
    }

    getName() {
        return "go";
    }
}
