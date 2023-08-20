export class Stone {
    #isBlack;
    #isBlink = false;

    constructor(isBlack) {
        this.#isBlack = isBlack; // black or white
    }

    isStone() {
        return true;
    }

    isNoStone() {
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

export class NoStone {
    isStone() {
        return false;
    }

    isNoStone() {
        return true;
    }
}

export class InvalidStone {
    isStone() {
        return false;
    }

    isNoStone() {
        return false;
    }
}
