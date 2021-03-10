import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { Redirect } from "react-router-dom";

export default function GoogleSignIn() {
    const [isAuthenticated, setAuthenticated] = useState(false);

    const handleLogin = async googleData => {
        if (googleData.error) {
            // handle error
            console.log(googleData.error);
        }
        else{
            console.log(googleData);
            const res = await fetch("api/login/auth/google", {
                method: "POST",
                body: JSON.stringify({
                    token: googleData.tokenId
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (res.status === 200) {
                setAuthenticated(true);
            }
            else {
                const data = await res.json();
                console.log(data.message);
                // display error message
            }
        }
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
            { isAuthenticated === true ? <Redirect to="/dashboard"/> : null}
        </>

    );
}