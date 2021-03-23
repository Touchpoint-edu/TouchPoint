import React, {useEffect, useState, useContext} from "react";
import Close from "../Components/Close";
import { createPortal } from "react-dom";
import Button from "../Components/Button";
import {DashboardContext } from "../contexts.js";



const modalContainer = document.getElementById("modal-container");

export default function StudentBehaviorModal({ open,  onClose }) {
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
     
    function handleSubmitBehavior(e) {
        e.preventDefault();
        onClose();
    }

    function handleDeleteStudent(e) {
     
        onClose();
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
           
                      <div className="mt-8 d-flex justify-content-start ml-5 modal-header-text">
                          <h2>Student Name</h2>
                      </div>
                      <hr className="solid my-4" />
                      <div className = "d-flex justify-content-between">
                        <Button
                            className="h-12 text-xl submit_button ml-5 mt-2 mb-2"
                            fullWidth={true}
                            onSubmit = {handleSubmitBehavior}
                            onClose = {onClose}
                        >
                            Submit Behavior
                        </Button>
                        <Button
                            className="h-12 text-xl delete_button mr-5 mt-2 mb-2"
                            fullWidth={true}
                            onClick= {handleDeleteStudent}
                            onClose = {onClose}
                        >
                            Delete Student
                        </Button>
                      </div>
                     
                      
            
                 
            </div>
          </div>
        </div>
      </div>
    </>
    , 
    modalContainer
  );
}

