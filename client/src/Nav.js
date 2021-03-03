import React, {useContext, useState} from 'react';
import { NavLink } from "react-router-dom";
import { DataStoreContext } from "./contexts";
import SigninSignupModal from './SigninSignupModal';
import {logout} from './auth';
import Button from './Button';


export default function Nav(){
    const [modalOpen, setModalOpen] = useState(false);
    const [modalVariant, setModalVariant] = useState("signIn");
    const openModal = (variant) => {
        setModalVariant(variant);
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const { user, setUser } = useContext(DataStoreContext);


    async function logoutUser() {
        await logout();
        setUser(null);
    }

    return(
        <nav className="nav-scroller py-4 mb-2 mt-2">
            <div className="nav d-flex">
                <div className = "p-2 flex-grow-1">
                <img className= "ml-2 logo_image" src="logo_nav.png" alt="logo" data-testid="logo-image"></img>
                </div>
                {user ? 
                <>
                    <NavLink 
                        className= "logout_button mt-1 p-3" 
                        to="/" 
                        onClick={logoutUser}
                    >
                        Log Out
                    </NavLink>
                </> 
                : 
                <>
                    <Button className="mr-1 signin_button" onClick={() => openModal("signIn")}>
                        Sign in
                    </Button>
                    <Button className="signup_button" onClick={() => openModal("signUp")} >
                        Sign Up
                    </Button>
                    {modalOpen && <SigninSignupModal
                        open={modalOpen}
                        onClose={closeModal}
                        variant={modalVariant}
                        toggleVariant={() =>
                        setModalVariant(modalVariant === "signIn" ? "signUp" : "signIn")
                    }
                />}
                
                </>
                
                }

            </div>
        </nav>
    );
}