export class PlayerSquare {
    #isBlack;
    #isLatestMove = false;
    #isInOpen3 = false; // OXXXO
    #isInOpen4 = false; // XXXXXO or OXXXX or OXXXXO
    #isIn5 = false;

    constructor(isBlack) {
        this.#isBlack = isBlack; // black or white
    }

    isMarkedByPlayer() {
        return true;
    }

    isEmpty() {
        return false;
    }

    isBlack() {
        return this.#isBlack;
    }

    isIn5() {
        return this.#isIn5;
    }

    setIn5() {
        this.#isIn5 = true;
        return this;
    }

    isInOpen3() {
        return this.#isInOpen3;
    }

    setInOpen3() {
        this.#isInOpen3 = true;
        return this;
    }

    isInOpen4() {
        return this.#isInOpen4;
    }

    setInOpen4() {
        this.#isInOpen4 = true;
        return this;
    }

    isLatestMove() {
        return this.#isLatestMove;
    }

    setLatestMove(isLatestMove) {
        this.#isLatestMove = isLatestMove;
        return this;
    }

    // care about #isBlack only
    clone() {
        return new PlayerSquare(this.#isBlack);
    }
}

export class EmptySquare {
    isMarkedByPlayer() {
        return false;
    }

    isEmpty() {
        return true;
    }

    isLatestMove() {
        return false;
    }

    clone() {
        return new EmptySquare();
    }
}

export class VirtualSquare {
    isMarkedByPlayer() {
        return false;
    }

    isEmpty() {
        return false;
    }

    clone() {
        return new VirtualSquare();
    }
}
