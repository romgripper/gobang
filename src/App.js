import StateProvider from "./GameStateContext";
import Board from "./Board";
import "./App.css";

export default function App({ gameName }) {
    return (
        <>
            <StateProvider gameName={gameName}>
                <Board />
            </StateProvider>
        </>
    );
}
