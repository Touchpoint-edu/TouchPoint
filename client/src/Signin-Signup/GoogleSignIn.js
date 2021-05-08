import React, { useState, useContext } from "react";
import GoogleLogin from "react-google-login";
import { Redirect } from "react-router-dom";
import { DataStoreContext } from "../contexts.js";

export default function GoogleSignIn({onClose, buttonText, dbFunc}) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [googleErrorMsg, setGoogleErrorMsg] = useState("");
    const { setUser } = useContext(DataStoreContext);
    const handleLogin = async (googleData) => {
        if (googleData.error === "idpiframe_initialization_failed") {
            setGoogleErrorMsg(`Please enable third party cookies and try again.`);    
        }

        if (googleData.error === "access_denied") {
            setGoogleErrorMsg(`Please accept the required permissions.`);    
        }
        
        if (googleData.tokenId) {
            const res = await dbFunc(googleData.tokenId);

            if (res.status === 200) {
                const json = await res.json()
                setUser(json.name)
                setAuthenticated(true);
                onClose();
            } else if (res.status === 201) {
                setGoogleErrorMsg("Your account has been successfully created.");
            } else {
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