import GameBase from "./GameBase";

export default class Go extends GameBase {
    INITIAL_STATE;

    constructor() {
        super(19, 19);
        this.INITIAL_STATE = {
            isNextBlack: true,
            hasWinner: false,
            stones: super.createInitialStones()
        };
    }

    getName() {
        return "go";
    }
}
