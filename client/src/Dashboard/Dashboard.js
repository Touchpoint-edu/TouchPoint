import React, {useState, useEffect} from "react";
import StudentGrid from "./StudentGrid.js";
import {InputGroup, FormControl, Button} from 'react-bootstrap'



export default function Dashboard () {


    const [students, setStudents] = useState(["First, Last 1", "First, Last 2", "First, Last 3", "First, Last 4", "First, Last 5", 
    "First, Last 6", "First, Last 7", "First, Last 8", "First, Last 9", "First, Last 10",  "First, Last 11", "First, Last 12", "First, Last 13",
    "First, Last 14", "First, Last 15", "First, Last 16", "First, Last 17", "First, Last 18", "First, Last 19", "First, Last 20", "First, Last 21", 
    "First, Last 22", "First, Last 23", "First, Last 24", "First, Last 25", "First, Last 26", "First, Last 27", "First, Last 28", "First, Last 29",
    "First, Last 30", "First, Last 31", "First, Last 32", "First, Last 33", "First, Last 34", "First, Last 35", "First, Last 36"]); 


    const [studentName, setStudentName] = useState("");
    const [size, setSize] = useState((students.length/6)*100)
    const [nameError, setNameError] = useState(false); 

    function addStudent(event){
        event.preventDefault();
        if(studentName.length > 1){
          setNameError(false);
          const s = students.concat(studentName);
          setStudents(s);
          if(s.length%6 == 1){
            setSize(size+100);
          }
        } else {
          setNameError(true);
        }
        
     
    }
    
    function handleNameChange(event) {
      setStudentName(event.target.value);
    }
   
    return (
      <>
        <div className = "dash"> 
          <div className="add-button-container "> 
            <form onSubmit = {addStudent} >
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Student Name"
                  aria-label="Student Name"
                  aria-describedby="basic-addon2"
                  value = {studentName}
                  onChange={handleNameChange}

                />
                <InputGroup.Append>
                  <Button className = "add-button btn btn-success" type="submit">+</Button>
                </InputGroup.Append>
              </InputGroup>
            </form>
          </div>
        <div className = "grid-container">
          <StudentGrid students = {students} setStudents = {setStudents}></StudentGrid>
        </div>
      </div>
      {nameError && <div className = "name-error"> Please enter a name.</div>}
      </>
    );
    
  }
