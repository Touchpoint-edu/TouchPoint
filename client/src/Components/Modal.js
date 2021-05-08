import { useEffect } from "react";
import { createPortal } from "react-dom";
import Close from "../Components/Close";
import Button from "./Button";
import Modal2 from 'react-bootstrap/Modal';

let modalContainer = document.getElementById("modal-container");


function stopPropagation(e) {
    e.stopPropagation();
}

export default function Modal({open, onClose, titleColor, title, children, scrollable, onSubmit, submitText, onReset, resetText}) {
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

    return (open && createPortal(
        <>
            <div className="modal-backdrop show"></div>
            <div className="modal" tabIndex="-1" style={{ display: "block" }} >
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div className="modal-content pb-3" onClick={stopPropagation}>
                        <div className="d-flex justify-content-end mr-3 mt-3 ">
                            <div className="invisible " onClick={onClose}>
                                <Close />
                            </div>
                            <div className="modal-close cursor-pointer z-50" onClick={onClose}>
                                <Close />
                            </div>
                        </div>
                        <div className="modal-body" scrollable = {true}>
                            <div className="mt-8 d-flex justify-content-start ml-5 modal-title">
                                <h2 style={{color: titleColor}}>{title}</h2>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
        ,
        modalContainer
    ));
}