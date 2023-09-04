import UiGame from "./component/UiGame";
import UiBoard from "./component/UiBoard";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import Login from "./component/Login";
import SignUp from "./component/SignUp";
import Header from "./component/Header";

import "./App.css";

let gameName = new URLSearchParams(window.location.search).get("game") ?? "gobang";
gameName = gameName.toLowerCase();
if (gameName !== "go") {
    gameName = "gobang";
}

const cookies = new Cookies();
const client = StreamChat.getInstance("7mcca6yx3r9d");

export default function App() {
    const token = cookies.get("token");
    const [isAuth, setIsAuth] = useState(false);

    if (token) {
        client
            .connectUser(
                {
                    id: cookies.get("userId"),
                    name: cookies.get("username"),
                    hashedPassword: cookies.get("hashedPassword")
                },
                token
            )
            .then((user) => {
                setIsAuth(true);
            });
    }

    useEffect(() => {
        document.title = gameName.charAt(0).toUpperCase() + gameName.slice(1);
    }, []);

    return isAuth ? (
        <Chat client={client}>
            <UiGame gameName={gameName}>
                <Header setIsAuth={setIsAuth} />
                <UiBoard />
            </UiGame>
        </Chat>
    ) : (
        <>
            <SignUp setIsAuth={setIsAuth} />
            <Login setIsAuth={setIsAuth} />
        </>
    );
}
