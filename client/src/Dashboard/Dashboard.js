import React, { useCallback, useState } from "react";
import StudentGrid from "./StudentGrid.js";
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export default function Dashboard () {

    
    const [students, setStudents]   = useState([
      {
        id: 0,
        name: "First, Last 1",
        data: 
          {
            category: 0,
            behavior: 0,
          },
        
      },
      {
        id: 1,
        name: "First, Last 2",
        data: 
          {
            category: 1,
            behavior: 0,
          },
        
      },
      {
        id: 2,
        name: "First, Last 3",
        data: 
          {
            category: 2,
            behavior: 0,
          },
        
      },
      {
        id: 3,
        name: "First, Last 4",
        data: 
          {
            category: 3,
            behavior: 0,
          },
        
      },
      {
        id: 4,
        name: "First, Last 5",
        data: 
          {
            category: 0,
            behavior: 1,
          },
        
      },
      {
        id: 5,
        name: "First, Last 6",
        data: 
          {
            category: 1,
            behavior: 1,
          },
        
      },
      {
        id: 6,
        name: "First, Last 7",
        data: 
          {
            category: 2,
            behavior: 1,
          },
        
      },
      {
        id: 7,
        name: "First, Last 8",
        data: 
          {
            category: 3,
            behavior: 1,
          },
        
      },
      {
        id: 8,
        name: "First, Last 9",
        data: {
            category: 0,
            behavior: 2,
        },
        
      },
      {
        id: 9,
        name: "First, Last 10",
        data: 
          {
            category: 1,
            behavior: 2,
          },
       
      },
      {
        id: 10,
        name: "First, Last 11",
        data: 
          {
            category: 2,
            behavior: 2,
          },
        
      },
      {
        id: 11,
        name: "First, Last 12",
        data: 
          {
            category: 3,
            behavior: 2,
          },
        
      },
    ]);
    
    const [studentName, setStudentName] = useState("");
    const [cols, setCols] = useState(6); 
    const [size, setSize] = useState((students.length/cols)*100)
    const [nameError, setNameError] = useState(false); 
    const [editChart, setEditChart] = useState(false);
    
    
    const handle1 = useFullScreenHandle();
   
    
    function addStudent(event){
        event.preventDefault();
        if(studentName.length > 1){
          setNameError(false);
          const newStud = {
            id: students.length,
            name: studentName,
            data: {},
          }
          const s = students.concat(newStud);
          setStudents(s);
          if(s.length%cols == 1){
            setSize(size+100);
          }
        } else {
          setNameError(true);
        }
        
     
    }
    
    function handleNameChange(event) {
      setStudentName(event.target.value);
    }

    function addCol(){
      setCols(cols + 1);

    }

    function removeCol(){
      setCols(cols - 1);
      setSize(size+100);

    }

    function handleChartSave(){
      if(editChart == false){
        //save the chart
      }
      setEditChart(!editChart);
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
                  disabled = {editChart}
                />
                <InputGroup.Append>
                  <Button className = "add-button btn btn-success" disabled = {editChart} type="submit">+</Button>
                </InputGroup.Append>
              </InputGroup>
            </form>
          </div>
          
          <div className = "grid-container">
            {editChart ? 
              <>
              <StudentGrid students = {students} setStudents = {setStudents} size = {size} edit = {editChart} handle1={handle1} cols = {cols}></StudentGrid>
              <FullScreen handle={handle1}>
                  <StudentGrid  className = "full-screenable-node" students = {students} setStudents = {setStudents} size = {size} edit = {editChart} handle1={handle1} cols = {cols}></StudentGrid>
              </FullScreen> </> :
              <StudentGrid students = {students} setStudents = {setStudents} size = {size} edit = {editChart} handle1={handle1} cols = {cols}></StudentGrid>
            } 
          </div>

          
          <div className = "actions-cont col">
            <div className ="edit-button-container row">
              <div>
              <Button
                      className="edit-button btn btn-success"
                      onClick = {handleChartSave}
                >
                      {editChart ? (<>Edit Seating</>):(<>Save Seating</>)}
                </Button>
              </div>
            </div>
            <div className ="col-button-container row">
              <div>
                <Button
                      className="col-btn btn btn-success"
                      onClick = {addCol}
                >
                      +
                </Button>
                columns
                <Button
                        className="col-btn btn btn-success"
                        onClick = {removeCol}
                  >
                      -
                </Button>
              </div>
            </div>
            <div className ="edit-button-container row">
              <div>
                <Button
                      className="full-button btn btn-success"
                      onClick = {handle1.enter}
                      disabled = {editChart} 
                >
                      Full Screen
                </Button>
              </div>
            </div>
            
          </div>
          

      </div>
      {nameError && <div className = "name-error"> Please enter a name.</div>}

      </>
    );
    
  }
