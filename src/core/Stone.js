export class Stone {
    #isBlack;
    #isBlink = false;

    constructor(isBlack) {
        this.#isBlack = isBlack; // black or white
    }

    isStone() {
        return true;
    }

    isNonStone() {
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
}

export class NonStone {
    isStone() {
        return false;
    }

    isNonStone() {
        return true;
    }
}

export class InvalidStone {
    isStone() {
        return false;
    }

    isNonStone() {
        return false;
    }
}
