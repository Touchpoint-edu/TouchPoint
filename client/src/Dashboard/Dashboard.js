import React, {useState, useEffect} from "react";
import StudentGrid from "./StudentGrid.js";
import {InputGroup, FormControl, Button} from 'react-bootstrap'
import { DashboardContext } from "../contexts.js";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap
} from "react-grid-dnd";


export default function Dashboard () {


    const [students, setStudents] = useState(["First, Last 1", "First, Last 2", "First, Last 3", "First, Last 4", "First, Last 5", 
    "First, Last 6", "First, Last 7", "First, Last 8", "First, Last 9", "First, Last 10",  "First, Last 11", "First, Last 12", "First, Last 13",
    "First, Last 14", "First, Last 15", "First, Last 16", "First, Last 17", "First, Last 18", "First, Last 19", "First, Last 20", "First, Last 21", 
    "First, Last 22", "First, Last 23", "First, Last 24", "First, Last 25", "First, Last 26", "First, Last 27", "First, Last 28", "First, Last 29",
    "First, Last 30", "First, Last 31", "First, Last 32", "First, Last 33", "First, Last 34", "First, Last 35", "First, Last 36"]); 
    var s = students;

    const [studentName, setStudentName] = useState("");
    const [size, setSize] = useState((students.length/6)*100)
    // target id will only be set if dragging from one dropzone to another.
    function onChange(sourceId, sourceIndex, targetIndex, targetId) {
      const nextState = swap(students, sourceIndex, targetIndex);
      setStudents(nextState);
    }

    function addStudent(event){
        event.preventDefault();
        students.push(studentName);
        setStudents(students);
        s = students;
        if(students.length%6 == 1){
          setSize(size+100);
        }
     
    }
    
    function handleNameChange(event) {
      setStudentName(event.target.value);
    }
   
    return (
    
        <div className = "d-flex"> 
        <div className="add-button-container"> 
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
              <Button className = "add-button" type="submit">+</Button>
            </InputGroup.Append>
          </InputGroup>
        </form>
        
        </div>
        <div className = "grid-container">
        <GridContextProvider onChange={onChange}>
          <GridDropZone
            id="items"
            className="dropzone"
            boxesPerRow={6}
            rowHeight={100}
            style = {{height: size}}
          >
          {s && s.length ? (
            s.map(item => (
              <GridItem key={item}>
                  <div className = "grid-item">
                    <div className = "tile">
                        {item}
                    </div>
                  </div>
                
              </GridItem>
            )) ) : <></>}
          </GridDropZone>
        </GridContextProvider>
        </div>
      </div>


    );
    
  }
