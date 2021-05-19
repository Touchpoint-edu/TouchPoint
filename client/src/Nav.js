import React, {useContext, useState} from 'react';
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { DataStoreContext } from "./contexts";
import LoginForm from './Signin-Signup/LoginForm';
import SignupForm from './Signin-Signup/SignupForm';
import DashboardHeader from './Dashboard/DashboardHeader';
import {logout} from './api/auth';
import Button from './Components/Button';
import Modal from './Components/Modal';

export default function Nav(){
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("Sign In");

    const { user, setUser, students, setStudents } = useContext(DataStoreContext);
    
    const openModal = (title) => {
        setModalTitle(title);
        setModalOpen(true);
    };
    const closeModal = () => {
        console.log("closing modal");
        setModalOpen(false);
    }

    async function logoutUser() {
        await logout();
        Cookies.remove("G_AUTHUSER_H")
        setUser(null);
    }

    return(
        <nav>
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
                    <Button className="mr-1 signin_button" onClick={() => openModal("Sign In")}>
                        Sign in
                    </Button>
                    <Button className="signup_button" onClick={() => openModal("Create your account")} >
                        Sign Up
                    </Button>
                    {
                        modalOpen && 
                            <Modal
                                open={modalOpen}
                                onClose={closeModal}
                                title={modalTitle}
                            >
                                    {(modalTitle === "Sign In") && <LoginForm onClose={closeModal} /> }
                                    {(modalTitle === "Create your account") && <SignupForm onClose={closeModal} /> }
                            </Modal>
                    }
                </>
                
                }

            </div>
        </nav>
    );
}