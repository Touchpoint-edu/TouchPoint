import React, { useState, useContext } from "react";
import GoogleLogin from "react-google-login";
import { Redirect } from "react-router-dom";
import { loginWithGoogle } from "../api/auth";

export default function GoogleSignIn({onClose, buttonText}) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [googleErrorMsg, setGoogleErrorMsg] = useState("");
    const handleLogin = async googleData => {
        if (googleData.error) {
            setGoogleErrorMsg("Login with Google failed. Please try again.");
        }
        else{
            console.log(googleData);
            const res = await loginWithGoogle(googleData.tokenId);

            if (res.status === 200) {
                setAuthenticated(true);
                onClose();
            }
            else {
                console.log(res);
                const data = await res.json();
                setGoogleErrorMsg(data.message);
            }
        }
    }

    return (
        <div className="text-center">
            <GoogleLogin
                clientId={"903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com"}
                buttonText={buttonText}
                className = "google_button w-100"
                onSuccess={handleLogin}
                onFailure={handleLogin}
            />
            <p className="text-red-500 mt-3 text-center">{googleErrorMsg}</p>
            { isAuthenticated === true ? <Redirect to="/dashboard"/> : null}
        </div>

    );
}