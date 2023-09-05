import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import "./Login.css";

function Login({ setIsAuth }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const cookies = new Cookies();

    function login() {
        Axios.post("/login", {
            username,
            password
        })
            .then((res) => {
                const { username, token, userId } = res.data;
                if (token) {
                    cookies.set("token", token);
                    cookies.set("userId", userId);
                    cookies.set("username", username);
                    setIsAuth(true);
                } else {
                    alert("User name or password is incorrect");
                }
            })
            .catch(console.error);
    }
    function signUp() {
        if (password !== passwordConfirm) {
            alert("Passwords don't match");
        }
        Axios.post("/signup", {
            username,
            password
        }).then((res) => {
            const { token, userId, username, hashedPassword } = res.data;
            if (token) {
                cookies.set("token", token);
                cookies.set("userId", userId);
                cookies.set("username", username);
                cookies.set("hashedPassword", hashedPassword);
                setIsAuth(true);
            }
        });
    }
    const loginContent = (
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
            <button onClick={login}>Login</button>
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
            <button onClick={signUp}>Sign Up</button>
        </>
    );
    return (
        <div className="login">
            <div>
                <label for="signupCheckbox">
                    <input
                        id="signupCheckbox"
                        type="checkbox"
                        checked={isSignUp}
                        onClick={(e) => setIsSignUp(e.target.checked)}
                    ></input>
                    SignUp
                </label>
                <div className="loginSub">{(isSignUp && signUpContent) || loginContent}</div>
            </div>
        </div>
    );
}

export default Login;