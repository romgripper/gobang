import { useState, useRef } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import Constant from "../core/Constant";
import PersistUtil from "../core/PersistUtil";

function Login({ setIsAuth }) {
    const [username, setUsername] = useState(PersistUtil.getUsername());
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const loginButton = useRef();
    const signupButton = useRef();

    const cookies = new Cookies();

    function validateInput() {
        if (!username) {
            alert("Please input username");
            return false;
        }
        if (!password) {
            alert("Please input password");
            return false;
        }
        return true;
    }

    function login() {
        if (!validateInput()) {
            return;
        }

        Axios.post("/login", {
            username,
            password
        })
            .then((res) => {
                const { username, token, userId } = res.data;
                if (token) {
                    cookies.set(Constant.COOKIE_TOKEN, token);
                    cookies.set(Constant.COOKIE_USER_ID, userId);
                    PersistUtil.persistUsername(username);
                    setIsAuth(true);
                } else {
                    alert(res.data.message);
                }
            })
            .catch(console.error);
    }
    function signUp() {
        if (password !== passwordConfirm) {
            alert("Passwords don't match");
            return;
        }
        if (!validateInput()) {
            return;
        }

        Axios.post("/signup", {
            username,
            password
        }).then((res) => {
            const { token, userId, username, hashedPassword } = res.data;
            if (token) {
                cookies.set(Constant.COOKIE_TOKEN, token);
                cookies.set(Constant.COOKIE_USER_ID, userId);
                PersistUtil.persistUsername(username);
                cookies.set(Constant.COOKIE_HASHED_PASSWORD, hashedPassword);
                setIsAuth(true);
            } else {
                alert(res.data.message);
            }
        });
    }

    function handleKey(e) {
        if (e.key === "Enter") {
            (isSignUp ? signupButton : loginButton).current.click();
        }
    }

    const loginContent = (
        <>
            <input
                placeholder="Username"
                value={username}
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <input
                placeholder="Password"
                type="password"
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />
            <button ref={loginButton} onClick={login}>
                Login
            </button>
        </>
    );
    
    const signUpContent = (
        <>
            <input
                placeholder="Username"
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <input
                placeholder="Password"
                type="password"
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />
            <input
                placeholder="Password again"
                type="password"
                onChange={(event) => {
                    setPasswordConfirm(event.target.value);
                }}
            />
            <button ref={signupButton} onClick={signUp}>
                Sign Up
            </button>
        </>
    );
    return (
        <div className="login" onKeyUp={handleKey}>
            <label for="signupCheckbox">
                <input
                    id="signupCheckbox"
                    type="checkbox"
                    checked={isSignUp}
                    onClick={(e) => setIsSignUp(e.target.checked)}
                ></input>
                Sign up
            </label>
            <div className="loginSub">{(isSignUp && signUpContent) || loginContent}</div>
        </div>
    );
}

export default Login;
