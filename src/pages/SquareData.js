export class PlayerSquare {
    #isBlack;
    #isIn5 = false;
    #isLatestMove = false;

    constructor(isBlack) {
        this.#isBlack = isBlack; // black or white
    }

    isMarkedByPlayer() {
        return true;
    }

    isEmpty() {
        return false;
    }

    showWarning() {
        return false;
    }

    setShowWarning() {
        return this;
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
    #showWarning = false;

    isMarkedByPlayer() {
        return false;
    }

    isEmpty() {
        return true;
    }

    showWarning() {
        return this.#showWarning;
    }

    setShowWarning(showWarning) {
        this.#showWarning = showWarning;
        return this;
    }

    isLatestMove() {
        return false;
    }

    isIn5() {
        return false;
    }

    // ignore showWarning
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

    showWarning() {
        return false;
    }
}
