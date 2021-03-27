import React, {useEffect, useState, useContext} from "react";
import Close from "../Components/Close";
import { createPortal } from "react-dom";
import Button from "../Components/Button";
import {DashboardContext } from "../contexts.js";
import {Form, Row, Col} from "react-bootstrap";



const modalContainer = document.getElementById("modal-container");

export default function StudentBehaviorModal({ open,  onClose, students, setStudents, student }) {
    const data = [
        {
            id: 0,
            category: "Engagement",
            behaviors: [
                {
                    id: 0,
                    behavior: "Relevant Question"
                },
                {
                    id: 1,
                    behavior: "Relevant Answer"
                },
                {
                    id: 2,
                    behavior: "Quality Discussion"
                },
                {
                    id: 3,
                    behavior: "Focused Work"
                },
                {
                    id: 4,
                    behavior: "Paying Attention"
                },
                {
                    id: 5,
                    behavior: "Focused Reading"
                },
                {
                    id: 6,
                    behavior: "Note Taking"
                },
                {
                    id: 7,
                    behavior: "Group Work"
                },

            ]
        },
        {
            id: 1,
            category: "Distraction",
            behaviors: [
                {
                    id: 0,
                    behavior: "Gaming"
                },
                {
                    id: 1,
                    behavior: "Talking"
                },
                {
                    id: 2,
                    behavior: "Cell Phone"
                },
                {
                    id: 3,
                    behavior: "Noise Making"
                },
                {
                    id: 4,
                    behavior: "Out of Seat"
                },

            ]
        },
        {
            id: 2,
            category: "Social",
            behaviors: [
                {
                    id: 0,
                    behavior: "Withdrawn"
                },
                {
                    id: 1,
                    behavior: "Quiet"
                },
                {
                    id: 2,
                    behavior: "Angry"
                },
                {
                    id: 3,
                    behavior: "Sarcastic"
                },
                {
                    id: 4,
                    behavior: "Instigating Others"
                },
                {
                    id: 5,
                    behavior: "Attention Seeking"
                },
                

            ]
        },
        
    ]
    const [selectedCategoryId, setSelectedCategoryId] = useState("-");
    const [filteredBehaviors, setFilteredBehaviors] = useState([]);
    const [selectedBehavior, setSelectedBehavior] = useState("");
    const options = [{ id: "-", category: "Select Category" }].concat(data);

    
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
        //add behavior with event value to the student info
        e.preventDefault();
        onClose();
    }

    function handleDeleteStudent(e) {
        //delete student from database
        onClose();
    }

      function handleCategoryChange(event){
        const isNoneSelected = event.target.value === "-";
        if (isNoneSelected) {
            setFilteredBehaviors([]);
        } else {
            const selectedCategoryId = Number(event.target.value);
            const filteredBehaviors = data.filter((c) => {  
                if(c.id === selectedCategoryId){
                    return c.behaviors;
                }
            });
            setFilteredBehaviors(filteredBehaviors[0].behaviors);
           

        }
        setSelectedCategoryId(event.target.value);
        
    }
    function handleOptionChange(event) {
        setSelectedBehavior(event.target.value);
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
                          <h2 style={{color:"#40904C"}}>{student[0].name}</h2>
                      </div>
                      <div>
                        <select
                            className="form-control w-50 ml-5 mt-3"
                            value={selectedCategoryId}
                            onChange={handleCategoryChange}
                        >
                                {options.map((cat) => {
                                    return (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category} 
                                    </option>
                                    );
                                })}
                        </select>

                      </div>
                      
                      
                            <form onSubmit={handleSubmitBehavior}>
                                <div className = "row w-75 ml-5 mt-4">
                                <div className="col">
                                        {
                                        filteredBehaviors.length > 0 ? 
                                        filteredBehaviors.slice(0, (Math.floor(filteredBehaviors.length / 2))).map((item) => {
                                              return( 
                                                <div className="radio" key = {item.id}>
                                                    <label className="behavior-label">
                                                    <input type="radio" value={item.behavior} checked={selectedBehavior === item.behavior}  onChange={handleOptionChange} />
                                                         {item.behavior}
                                                    </label>
                                                </div>
                                               );
                                            })
                                         : <></>}  
                                 
                                </div>
                                <div className = "col">
                                        {filteredBehaviors.length > 0 ? 
                                            filteredBehaviors.slice((Math.floor(filteredBehaviors.length / 2))).map((item) => {
                                               return( 
                                               <div className="radio" key = {item.id}>
                                                <label className = "behavior-label">
                                                    <input type="radio" value={item.behavior} checked={selectedBehavior === item.behavior} onChange={handleOptionChange} />
                                                     {item.behavior}
                                                </label>
                                                </div>
                                               );
                                            })
                                         : <></>}        
                                </div>
                                </div>
                                <hr className="solid my-4" />
                                <div className = "d-flex justify-content-between">
                                    <Button
                                        className="h-12 text-xl behavior_button ml-5 mt-2 mb-2"
                                        fullWidth={true}
                                        onSubmit = {handleSubmitBehavior}
                                        onClose = {onClose}
                                        type = "submit"
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
                            </form>

            </div>
          </div>
        </div>
      </div>
    </>
    , 
    modalContainer
  );
}

