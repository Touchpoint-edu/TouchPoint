import React, {useContext} from 'react';
import { NavLink } from "react-router-dom";
import { DataStoreContext } from "./contexts";


export default function Nav(){
    const { isLoggedIn } = useContext(DataStoreContext);

    return(
    <>
        <nav className="nav-scroller py-4 mb-2 mt-2">
            <div className="nav d-flex">
                <div className = "p-2 flex-grow-1">
                <img className= "ml-2 logo_image" src="logo_nav.png" alt="logo" data-testid="logo-image"></img>
                </div>
                {isLoggedIn ? <>
                <NavLink 
                    className= "logout_button mt-1 p-3" 
                    to="/" 
                    
                >
                    Log Out
                </NavLink>
                </> 
                : <>
                <NavLink 
                    className= "signup_button mt-1 p-3" 
                    to="/signup" 
                    activeStyle={{
                        fontWeight: "bold",
                        color: "#40904C"
                    }}
                >
                    Sign Up
                </NavLink>
                <NavLink 
                    className= "signin_button mt-1 p-3"
                    to="/signin"
                    activeStyle={{
                        fontWeight: "bold",
                        color: "#83B55C"
                    }}
                >
                    Sign In
                </NavLink> </>}
            </div>
        </nav>
    </>
    );
}