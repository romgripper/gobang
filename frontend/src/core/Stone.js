export default class Stone {
    #isBlack;
    #isBlink = false;

    constructor(isBlack) {
        this.#isBlack = isBlack; // black or white
    }

    isStone() {
        return true;
    }

    isVacancy() {
        return false;
    }

    isBlack() {
        return this.#isBlack;
    }

    isBlink() {
        return this.#isBlink;
    }

    setBlink() {
        this.#isBlink = true;
        return this;
    }

    // care about #isBlack only
    clone() {
        return new Stone(this.#isBlack);
    }

    /*
        null        -> 0
        black       -> 1
        blink black -> -1
        white       -> 2
        blink white -> -2
    */

    static toInt(stone) {
        if (!stone) {
            return 0;
        }
        if (stone.isBlack()) {
            return stone.isBlink() ? -1 : 1;
        }
        return stone.isBlink() ? -2 : 2;
    }

    static fromInt(value) {
        switch (value) {
            case 1:
                return new Stone(true);
            case -1:
                return new Stone(true).setBlink();
            case 2:
                return new Stone(false);
            case -2:
                return new Stone(false).setBlink();
            default:
                return null;
        }
    }
}
