import React, { useCallback, useState } from "react";
import StudentGrid from "./StudentGrid.js";
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import DashboardHeader from "./DashboardHeader";
import { fetchAllPeriods } from "../api/class_period.js";

export default function Dashboard () {

    
    const [students, setStudents] = useState([[
      {
        id: 0,
        name: "First, Last 1",
        data: 
          {
            row: 0,
            col: 0,
          },
        
      },
      {
        id: 1,
        name: "First, Last 2",
        data: 
          {
            row: 1,
            col: 0,
          },
        
      },
      {
        id: 2,
        name: "First, Last 3",
        data: 
          {
            row: 2,
            col: 0,
          },
        
      },
      {
        id: 3,
        name: "First, Last 4",
        data: 
          {
            row: 3,
            col: 0,
          },
        
      },
      {
        id: 4,
        name: "First, Last 5",
        data: 
          {
            row: 0,
            col: 1,
          },
        
      },
      {
        id: 5,
        name: "First, Last 6",
        data: 
          {
            row: 1,
            col: 1,
          },
        
      },
      {
        id: 6,
        name: "First, Last 7",
        data: 
          {
            row: 2,
            col: 1,
          },
        
      },
      {
        id: 7,
        name: "First, Last 8",
        data: 
          {
            row: 3,
            col: 1,
          },
        
      },
      {
        id: 8,
        name: "First, Last 9",
        data: {
            row: 0,
            col: 2,
        },
        
      },
      {
        id: 9,
        name: "First, Last 10",
        data: 
          {
            row: 1,
            col: 2,
          },
       
      },
      {
        id: 10,
        name: "First, Last 11",
        data: 
          {
            row: 2,
            col: 2,
          },
        
      },
      {
        id: 11,
        name: "First, Last 12",
        data: 
          {
            row: 3,
            col: 2,
          },
        
      },
    ]]);
    
    const [studentName, setStudentName] = useState("");
    const [cols, setCols] = useState(6); 
    const [rows, setRows] = useState(6); 
    const [size, setSize] = useState((students.length/cols)*100)
    const [nameError, setNameError] = useState(false); 
    const [editChart, setEditChart] = useState(false);
    
    
    const handle1 = useFullScreenHandle();
    getStudents();
    async function getStudents(){
      const studentResp = await fetchAllPeriods();
      console.log(studentResp);
    }
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
      if (cols < 10) {
        setCols(cols + 1);
      }
    }

    function removeCol(){
      if (cols > 1) {
        setCols(cols - 1);
      }
    }

    function addRow() {
      if (rows < 10) {
        setRows(rows + 1);
      }
    }

    function removeRow() {
      if (cols > 1) {
        setRows(rows - 1);
      }
    }

    function handleChartSave(){
      if(editChart == false){
        //save the chart
      }
      setEditChart(!editChart);
    }

   
    return (
      <>
        <div className = "d-flex justify-content-around p-5 h-100"> 
        <div className="grid-container">
            <StudentGrid students = {students} setStudents = {setStudents} size = {size} edit = {editChart} handle1={handle1} cols = {cols} rows={rows}></StudentGrid>
          <FullScreen handle={handle1}>
                <StudentGrid  className = "full-screenable-node" students = {students} setStudents = {setStudents} size = {size} edit = {editChart} handle1={handle1} cols = {cols} rows={rows}></StudentGrid>
            </FullScreen>
        </div>
          <div className = "actions-cont">
            <div className="action">
              <Button
                      className="edit-button btn btn-success"
                      onClick = {handleChartSave}
                >
                      {editChart ? (<>Edit Seating</>):(<>Save Seating</>)}
                </Button>
            </div>
            <div className="action"> 
            <form onSubmit = {addStudent} >
              <InputGroup className="add-student">
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
              <div className="action d-flex justify-content-between">
                <Button
                      className="btn btn-success"
                      onClick = {addCol}
                >
                      +
                </Button>
                <div className="mx-4">columns</div>
                <Button
                        className="btn btn-success"
                        onClick = {removeCol}
                  >
                      -
                </Button>
            </div>
            <div className="action d-flex justify-content-between">
                <Button
                      className="btn btn-success"
                      onClick = {addRow}
                >
                      +
                </Button>
                <div className="mx-4">rows</div>
                <Button
                        className="btn btn-success"
                        onClick = {removeRow}
                  >
                      -
                </Button>
            </div>
            <div className="action">
              <div>
                <Button
                      className="full-button btn btn-success"
                      onClick = {handle1.enter}
                      disabled = {!editChart} 
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
