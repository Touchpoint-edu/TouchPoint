import React from "react";

import Close from "./Close";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { createPortal } from "react-dom";



const modalContainer = document.getElementById("modal-container");

export default function SigninSignupModal({ open, variant, onClose, toggleVariant }) {
  React.useEffect(() => {
    function handleEscapeKey(event) {
      if (event.keyCode === 27 && open) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);

    return function cleanup() {
      document.removeEventListener("keydown", handleEscapeKey);
    };
    }, [open, onClose]);

  function stopPropagation(e) {
    e.stopPropagation();
  }

  return createPortal(
      <>
      <div className="modal-backdrop show"></div>
      <div className="modal" tabIndex="-1" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content pb-3" onClick={stopPropagation}>
            <div className = "d-flex justify-content-end mr-3 mt-3 ">
                <div className="invisible " onClick={onClose}>
                <Close />
                </div>
                <div className="modal-close cursor-pointer z-50" onClick={onClose}>
                <Close />
                </div>
            </div>
            <div>
            {variant === "signIn" ? (
                <LoginForm  onClose={onClose}/>
            ) : (
                <SignupForm toggleVariant={toggleVariant} onClose={onClose} />
            )}
            </div>
            
          </div>
          

        </div>
      </div>
    </>
    , 
    modalContainer
  );
}

