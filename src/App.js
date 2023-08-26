import StateProvider from "./component/GameStateContext";
import UiBoard from "./component/UiBoard";
import "./App.css";
import { useEffect } from "react";

let gameName = new URLSearchParams(window.location.search).get("game") ?? "gobang";
gameName = gameName.toLowerCase();
if (gameName !== "go") {
    gameName = "gobang";
}

export default function App() {
    useEffect(() => {
        document.title = gameName.charAt(0).toUpperCase() + gameName.slice(1);
    }, []);
    return (
        <>
            <StateProvider gameName={gameName}>
                <UiBoard />
            </StateProvider>
        </>
    );
}
