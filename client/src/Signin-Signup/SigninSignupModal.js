import React, {useEffect} from "react";

import Close from "../Components/Close";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { createPortal } from "react-dom";

const modalContainer = document.getElementById("modal-container");

export default function SigninSignupModal({ open, variant, onClose, toggleVariant }) {
  useEffect(() => {
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
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog h-100 d-flex flex-column justify-content-center my-0">
          <div className="modal-content pb-3" onClick={stopPropagation}>
            <div className = "d-flex justify-content-end mr-3 mt-3 ">
                <div className="modal-close cursor-pointer z-50" onClick={onClose}>
                <Close />
                </div>
            </div>
            <div className="px-5">
            {variant === "signIn" ?
              <LoginForm onClose={onClose}/>
             : 
              <SignupForm toggleVariant={toggleVariant} onClose={onClose} />
            }
            </div>
            
          </div>
          

        </div>
      </div>
    </>
    , 
    modalContainer
  );
}

