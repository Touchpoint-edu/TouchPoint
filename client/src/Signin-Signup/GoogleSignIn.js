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
                clientId={"903480499371-0asb7fmnjuaet16han6ih2g8o3ph15qn.apps.googleusercontent.com"}
                // original: 903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com
                // gclass: 903480499371-r4hhlvmocekr1h8igpqbstf7c75tj5uv.apps.googleusercontent.com
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

// https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.courses.readonly&response_type=code&client_id=903480499371-r4hhlvmocekr1h8igpqbstf7c75tj5uv.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&flowName=GeneralOAuthFlow
// https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?redirect_uri=storagerelay%3A%2F%2Fhttp%2Flocalhost%3A3000%3Fid%3Dauth848392&response_type=permission%20id_token&scope=email%20profile%20openid&openid.realm&include_granted_scopes=true&client_id=903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com&ss_domain=http%3A%2F%2Flocalhost%3A3000&prompt&fetch_basic_profile=true&gsiwebsdk=2&flowName=GeneralOAuthFlow
