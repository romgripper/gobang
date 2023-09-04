import { useSquareSize, useGameState, useDispatch, useGameContext } from "./UiGame";
import Cookies from "universal-cookie";
import { useChatContext } from "stream-chat-react";

import "./Header.css";

const BLACK_PLAYER_IMAGE = `${process.env.PUBLIC_URL}/black.png`;
const WHITE_PLAYER_IMAGE = `${process.env.PUBLIC_URL}/white.png`;
const BLACK_PLAYER = "Black";
const WHITE_PLAYER = "White";

export default function Header({ setIsAuth }) {
    const state = useGameState();
    const dispatch = useDispatch();
    const squareSize = useSquareSize();
    const game = useGameContext();
    const { client } = useChatContext();

    const cookies = new Cookies();
    const playerName = cookies.get("username");

    const fontSize = squareSize / 2.2;
    const statusHeight = squareSize * 0.8;

    let currentPlayerImage;
    let currentPlayer;
    let nextPlayerImage;
    let nextPlayer;

    if (state.isNextBlack) {
        currentPlayerImage = WHITE_PLAYER_IMAGE;
        currentPlayer = WHITE_PLAYER;
        nextPlayerImage = BLACK_PLAYER_IMAGE;
        nextPlayer = BLACK_PLAYER;
    } else {
        currentPlayerImage = BLACK_PLAYER_IMAGE;
        currentPlayer = BLACK_PLAYER;
        nextPlayerImage = WHITE_PLAYER_IMAGE;
        nextPlayer = WHITE_PLAYER;
    }

    const commonStyle = {
        fontSize: fontSize,
        height: statusHeight,
        marginLeft: squareSize / 2
    };
    const backButton = (
        <button style={{ ...commonStyle, width: squareSize * 5 }} onClick={() => dispatch(game.createRollbackAction())}>
            Back
        </button>
    );

    const restartButton = (
        <button
            style={{ ...commonStyle, width: squareSize * 3 }}
            onClick={() => {
                if (state.hasWinner || window.confirm("Restart the game?")) dispatch(game.createRestartAction());
            }}
        >
            Restart
        </button>
    );

    function logout() {
        if (window.confirm("Do you want to logout?")) {
            cookies.remove("token");
            cookies.remove("userId");
            cookies.remove("hashedPassword");
            cookies.remove("channelName");
            cookies.remove("username");
            client.disconnectUser();
            setIsAuth(false);
        }
    }

    const logoutButton = (
        <button onClick={logout} style={{ ...commonStyle, width: squareSize * 2 }}>
            Logout
        </button>
    );

    const playerNameText = <span style={{ ...commonStyle, marginLeft: squareSize / 2 }}>{playerName}</span>;

    return (
        <div className="status" style={{ fontSize: fontSize, marginBottom: fontSize }}>
            {state.hasWinner && (
                <div>
                    Winner&nbsp;
                    <img
                        src={currentPlayerImage}
                        alt={currentPlayer}
                        style={{ width: statusHeight, height: statusHeight }}
                    />
                </div>
            )}
            {!state.hasWinner && (
                <div>
                    <img src={nextPlayerImage} alt={nextPlayer} style={{ width: statusHeight, height: statusHeight }} />
                </div>
            )}
            <div>
                {state.previousState && !state.hasWinner && backButton}
                {state.previousState && restartButton}
                {logoutButton}
                {playerNameText}
            </div>
        </div>
    );
}
