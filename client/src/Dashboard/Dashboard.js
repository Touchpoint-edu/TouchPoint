import React, { useCallback, useState, useEffect, useContext } from "react";
import StudentGrid from "./StudentGrid.js";
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import DashboardHeader from "./DashboardHeader";
import { fetchAllPeriods, updateSeatingChart } from "../api/class_period.js";
import { DashboardContext, DataStoreContext } from "../contexts.js";

export default function Dashboard() {


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
  const [periods, setPeriods] = useState([]);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [cols, setCols] = useState(6);
  const [rows, setRows] = useState(6);
  const [size, setSize] = useState((students.length / cols) * 100)
  const [nameError, setNameError] = useState(false);
  const [editChart, setEditChart] = useState(false);
  const [arrTest, setArrTest] = useState([]);

  const { selectedPeriod } = useContext(DataStoreContext);

  const handle1 = useFullScreenHandle();
  async function getStudents() {
    const studentResp = await fetchAllPeriods();
    const studentJson = await studentResp.json();
    console.log(studentJson);
    setPeriods(studentJson);
    if (studentJson[selectedPeriod]) {
      setRows(studentJson[selectedPeriod].rows);
      setCols(studentJson[selectedPeriod].columns);
      setStudents(studentJson[selectedPeriod].students);
      const newArr = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const found = students.find(student => {
            return student.row === i && student.col === j;
          });
          if (found) {
            newArr.push(found);
          }
          else {
            newArr.push({
              row: i,
              col: j
            });
          }
        }
      }
      setArrTest(newArr);
      console.log(arrTest);
    }
  }
  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    if (periods[selectedPeriod]) {
      setStudents(periods[selectedPeriod].students);
      setRows(periods[selectedPeriod].rows);
      setCols(periods[selectedPeriod].columns);
    }
    else {
      setStudents([]);
    }
  }, [selectedPeriod, periods])
  function addStudent(event) {
    event.preventDefault();
    const newArr = [...arrTest];
    console.log(newArr);
    let blank = newArr.find((student) => {
      return !student.hasOwnProperty("_id");
    });
    console.log(blank);
    // if (studentName.length > 1) {
    //   setNameError(false);
    //   const newStud = {
    //     id: students.length,
    //     name: studentName,
    //     data: {},
    //   }
    //   const s = students.concat(newStud);
    //   setStudents(s);
    //   if (s.length % cols == 1) {
    //     setSize(size + 100);
    //   }
    // } else {
    //   setNameError(true);
    // }


  }
  function updatePos(id, posObj) {
    setStudents((prev) => {
      console.log(id, posObj);
      const newArr = [...prev];
      const student1 = newArr.find(student => student._id === id);
      const student2 = newArr.find(student => {
        return student.row === posObj.row && student.col === posObj.col;
      });
      console.log("Swapping", student1, " and ", student2);
      if (student2) {
        student2.row = student1.row;
        student2.col = student1.col;
      }
      student1.row = posObj.row;
      student1.col = posObj.col;

      return newArr;
    })
  }



  function handleNameChange(event) {
    setStudentName(event.target.value);
  }

  function addCol() {
    if (cols < 10) {
      setCols(cols + 1);
    }
  }

  function removeCol() {
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

  function enterFullScreen() {
    handle1.enter();
    setFullScreenMode(true);
  }

  function handleChartSave() {
    if (editChart) {
      console.log(periods[selectedPeriod]._id);
      updateSeatingChart(periods[selectedPeriod]._id, rows, cols, students);
    }
    setEditChart(!editChart);
  }


  return (
    <div className="container-fluid justify-content-around p-5 h-100">
      <div className="row h-100">
        <div className="grid-container col-lg-9 col-xl-10 h-100">
          <FullScreen className="w-100" handle={handle1}>
            <StudentGrid fullScreenMode={fullScreenMode} updatePos={updatePos} students={students} setStudents={setStudents} size={size} edit={editChart} handle1={handle1} cols={cols} rows={rows} />
          </FullScreen>
        </div>
        <div className="actions-cont col-lg-3 col-xl-2 d-none d-lg-flex flex-column">
          <div className="action">
            <Button
              className="edit-button btn btn-success"
              onClick={handleChartSave}
            >
              {editChart ? (<>Save Seating</>) : (<>Edit Seating</>)}
            </Button>
          </div>
          
          <div className="action">
            <form onSubmit={addStudent} >
              <InputGroup className="add-student">
                <FormControl
                  placeholder="Student Name"
                  aria-label="Student Name"
                  aria-describedby="basic-addon2"
                  value={studentName}
                  onChange={handleNameChange}
                  disabled={!editChart}
                />
                <InputGroup.Append>
                  <Button className="add-button btn btn-success" disabled={!editChart} type="submit">+</Button>
                </InputGroup.Append>
              </InputGroup>
              {nameError && <div className="name-error"> Please enter a name.</div>}
            </form>
          </div>
          <div className="action d-flex justify-content-between">
            <Button
              className="btn btn-success"
              onClick={addCol}
              disabled={!editChart}
            >
              +
                </Button>
            <div className="mx-4">columns</div>
            <Button
              className="btn btn-success"
              onClick={removeCol}
              disabled={!editChart}
            >
              -
                </Button>
          </div>
          <div className="action d-flex justify-content-between">
            <Button
              className="btn btn-success"
              onClick={addRow}
              disabled={!editChart}
            >
              +
                </Button>
            <div className="mx-4">rows</div>
            <Button
              className="btn btn-success"
              onClick={removeRow}
              disabled={!editChart}
            >
              -
                </Button>
          </div>
          <div className="action">
            <div>
              <Button
                className="full-button btn btn-success"
                onClick={enterFullScreen}
                disabled={!!editChart}
              >
                Full Screen
                </Button>
            </div>
          </div>

        </div>

      </div>
    </div>

  );

}
