import StateProvider from "./GameStateContext";
import Board from "./Board";
import "./App.css";
import PreloadImageBoard from "./PreloadImageBoard";

export default function App() {
    return (
        <>
            <PreloadImageBoard isBlack={true} />
            <PreloadImageBoard isBlack={false} />
            <StateProvider>
                <Board />
            </StateProvider>
        </>
    );
}
