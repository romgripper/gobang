import StateProvider from "./GameStateContext";
import Board from "./Board";
import "./App.css";

export default function App() {
    let gameName = new URLSearchParams(window.location.search).get("game");
    if (gameName !== "go") {
        gameName = "gobang";
    }
    return (
        <>
            <StateProvider gameName={gameName}>
                <Board />
            </StateProvider>
        </>
    );
}
