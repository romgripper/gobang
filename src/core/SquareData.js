export class Stone {
    #isBlack;
    #isBlink = false;

    constructor(isBlack) {
        this.#isBlack = isBlack; // black or white
    }

    hasStone() {
        return true;
    }

    isEmpty() {
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

export class EmptySquare {
    hasStone() {
        return false;
    }

    isEmpty() {
        return true;
    }
}

export class VirtualSquare {
    hasStone() {
        return false;
    }

    isEmpty() {
        return false;
    }
}
