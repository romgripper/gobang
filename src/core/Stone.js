export class Stone {
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
}

export class Vacancy {
    isStone() {
        return false;
    }

    isVacancy() {
        return true;
    }
}

// Represent values whose coordinates are out of bound
export class InvalidStone {
    isStone() {
        return false;
    }

    isVacancy() {
        return false;
    }
}
