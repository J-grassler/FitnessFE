import React, { useState } from "react";

import { auth } from "../api";

const Auth = (props) => {
  const { setIsLoggedIn, message, setMessage } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="auth" onSubmit={(event) => event.preventDefault()}>
      <h3>Log-In or Sign-Up</h3>
      <h5 className="message">{message}</h5>
      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="username"
        className="login"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="password"
        className="login"
      />
      <button
        onClick={async (event) => {
          event.preventDefault();

          try {
            let result = await auth(username, password, true);

            if (result.error) {
              setMessage(result.error);
              return <h5 className="message">{message}</h5>;
            } else {
              setIsLoggedIn(true);
              setMessage(result.message);
            }
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Register
      </button>
      <button
        onClick={async (event) => {
          event.preventDefault();
          try {
            let result = await auth(username, password);

            if (result.error) {
              setMessage(result.error);
              return <h5 className="message">{message}</h5>;
            } else {
              setIsLoggedIn(true);
              setMessage(result.message);
            }
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Log In
      </button>
    </form>
  );
};

export default Auth;