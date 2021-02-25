import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { Redirect } from "react-router-dom";

export default function GoogleSignIn() {
    const [isAuthenticated, setAuthenticated] = useState(false);

    const handleLogin = async googleData => {
        const res = await fetch("api/login/auth/google", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.tokenId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json();

        if (res.status === 201) {
            setAuthenticated(true);
        }

        console.log(data);
    }

    return (
        <>
            <GoogleLogin
                clientId={"903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com"}
                buttonText="Log in with Google"
                className = "google_button ml-5"
                onSuccess={handleLogin}
                onFailure={handleLogin}
            />
            { isAuthenticated === true ? <Redirect to="/dashboard" /> : null}
        </>

    );
}