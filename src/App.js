import StateProvider from "./GameStateContext";
import Board from "./Board";
import "./App.css";

export default function App() {
    return (
        <>
            <StateProvider gameName="gobang">
                <Board />
            </StateProvider>
        </>
    );
}
