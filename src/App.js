import StateProvider from "./GameStateContext";
import Board from "./Board";
import "./App.css";

export default function App() {
    const gameName = new URLSearchParams(window.location.search).get("game") ?? "gobang";
    return (
        <>
            <StateProvider gameName={gameName}>
                <Board />
            </StateProvider>
        </>
    );
}
