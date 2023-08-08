import StateProvider from "./StateContext";
import Board from "./Board";

export default function App() {
    return (
        <StateProvider>
            <Board />
        </StateProvider>
    );
}
