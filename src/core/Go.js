import Game from "./Game";

export default class Go extends Game {
    
    constructor() {
        super(19, 19);
    }

    createInitialState() {
        return {
            isNextBlack: true,
            hasWinner: false,
            stones: this.createInitialStones()
        };
    }

    getName() {
        return "go";
    }
}
