import StateProvider from "./GameStateContext";
import Board from "./Board";

export default function App() {
    return (
        <StateProvider>
            <Board />
        </StateProvider>
    );
}
