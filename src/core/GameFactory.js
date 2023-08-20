import Go from "./Go";
import Gobang from "./Gobang";

const games = {
    go: null,
    gobang: null
};

export default function getGameInstance(gameName) {
    if (!games[gameName]) {
        const game = gameName === "go" ? new Go() : new Gobang();
        game.init();
        games[gameName] = game;
    }
    return games[gameName];
}
