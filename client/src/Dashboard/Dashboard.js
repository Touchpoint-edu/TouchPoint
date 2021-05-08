import React, { useCallback, useState, useEffect, useContext } from "react";
import StudentGrid from "./StudentGrid.js";
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import DashboardHeader from "./DashboardHeader";
import { fetchAllPeriods, updateSeatingChart } from "../api/class_period.js";
import { DashboardContext, DataStoreContext } from "../contexts.js";
import AddStudentForm from "./AddStudentForm"
import Cookies from 'js-cookie';
const NUM_OF_PERIODS = 8;

export default function Dashboard() {


  const [studentsArr, setStudentsArr] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [currPeriod, setCurrPeriod] = useState({
    rows: 6,
    columns: 6,
    students: []
  });
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [addStudentValidation, setAddStudentValidation] = useState("");
  const [editChart, setEditChart] = useState(false);

  const { selectedPeriod, reload, user} = useContext(DataStoreContext);
  const handle1 = useFullScreenHandle();
  async function getStudents() {
    console.log("working..?");
    const periodResp = await fetchAllPeriods();
    console.log(periodResp.body);
    if (periodResp.status === 200) {
      console.log("in here");
      const periodJson = await periodResp.json();
      console.log(periodJson);
      const periodArr = [];
      for (let i = 0; i < NUM_OF_PERIODS; i++) {
        const period = periodJson.find(period => period.periodNum === i);
        if (period) {
          periodArr.push(period);
        }
        else {
          periodArr.push({});
        }
      }
      setPeriods(periodArr);

    }
  }
  useEffect(() => {
    getStudents();
  }, [reload]);

  useEffect(() => {
    const newArr = [];
    for (let i = 0; i < currPeriod.rows; i++) {
      for (let j = 0; j < currPeriod.columns; j++) {
        const students = currPeriod.students;
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
    setStudentsArr(newArr);
  }, [currPeriod]);

  useEffect(() => {
    if (periods[selectedPeriod] && !!Object.keys(periods[selectedPeriod]).length) {
      setCurrPeriod(periods[selectedPeriod]);
    }
    else {
      setCurrPeriod({
        rows: 6,
        columns: 6,
        students: []
      });
    }
  }, [selectedPeriod, periods, user])

  console.log("USER:" + user)

  function addStudent(event) {
    event.preventDefault();
    const newArr = [...studentsArr];
    console.log(newArr);
    let blank = newArr.find((student) => {
      return !student.hasOwnProperty("name");
    });
    if (!blank) {
      setAddStudentValidation("No empty spots could be found, please increase the number of rows and/or columns.");
    }
    else {
      if (studentName.length > 1) {
        setAddStudentValidation("");
        blank.name = studentName;
        setStudentsArr(newArr);
        setStudentName("");
      } else {
        setAddStudentValidation("Please enter a name.");
      }
    }
  }
  const updatePos = useCallback(function (id, posObj) {
    setCurrPeriod((prev) => {
      const newArr = [...prev.students];
      const student1 = newArr.find(student => student._id === id);
      const student2 = newArr.find(student => {
        return student.row === posObj.row && student.col === posObj.col;
      });
      if (student2) {
        student2.row = student1.row;
        student2.col = student1.col;
      }
      student1.row = posObj.row;
      student1.col = posObj.col;
      return {...prev, students: newArr};
    })
  }, []);

  function handleNameChange(event) {
    setStudentName(event.target.value);
  }

  function updateCol(e) {
    const val = parseInt(e.target.value);
    const cols = currPeriod.columns;
    if (cols + val <= 10 && cols + val >= 1) {
      setCurrPeriod(prevState => {
        return {...prevState, columns: cols + val};
      });
    }
  }

  function updateRow(e) {
    const val = parseInt(e.target.value);
    const rows = currPeriod.rows;
    console.log(typeof val);
    if (rows + val <= 10 && rows + val >= 1) {
      setCurrPeriod(prevState => {
        return {...prevState, rows: rows + val};
      });
    }
  }

  function enterFullScreen() {
    handle1.enter();
    setFullScreenMode(true);
  }

  function handleChartSave() {
    if (editChart) {
      const toSave = studentsArr.filter((student) => student.hasOwnProperty("name"));
      updateSeatingChart(periods[selectedPeriod]._id, currPeriod.rows, currPeriod.columns, toSave);
      setPeriods(prevState => {
        const newArr = [...prevState];
        newArr[selectedPeriod] = currPeriod;
        return newArr;
      })
    }
    setEditChart(!editChart);
  }


  return (
    <div className="d-flex flex-column justify-content-around px-5 py-3 h-100">
      <DashboardHeader students = {studentsArr} curPeriodStudents={currPeriod.students} setStudents = {setStudentsArr}></DashboardHeader>
      <div className="flex-grow-1 d-flex flex-column flex-lg-row h-75 mt-2">
        <div className="grid-container mr-lg-3 h-100">
            <StudentGrid fullScreenMode={fullScreenMode} updatePos={updatePos} students={studentsArr} setStudents={setStudentsArr} edit={editChart} cols={currPeriod.columns} rows={currPeriod.rows} />
        </div>
        <div className="actions-cont mt-3 mt-lg-0 d-flex flex-lg-column justify-content-lg-start">
          <div className="action mr-3 mr-lg-0">
            <Button
              className="edit-button btn btn-success"
              onClick={handleChartSave}
            >
              {editChart ? (<>Save Seating</>) : (<>Edit Seating</>)}
            </Button>
          </div>

          {/* <div className="action">
          <AddStudentForm disabled={!editChart} currPeriod={currPeriod} setCurrPeriod={setCurrPeriod} students={studentsArr} setStudents={setStudentsArr} ></AddStudentForm>
          </div> */}
          {addStudentValidation !== "" && <div className="action text-red-500">{addStudentValidation}</div>}
          <div className="action d-flex justify-content-between mr-3 mr-lg-0">
            <Button
              className="btn btn-success"
              onClick={updateCol}
              disabled={!editChart}
              value={1}
            >
              +
                </Button>
            <div className="mx-4">columns</div>
            <Button
              className="btn btn-success"
              onClick={updateCol}
              disabled={!editChart}
              value={-1}
            >
              -
                </Button>
          </div>
          <div className="action d-flex justify-content-between mr-3 mr-lg-0">
            <Button
              className="btn btn-success"
              onClick={updateRow}
              disabled={!editChart}
              value={1}
            >
              +
                </Button>
            <div className="mx-4">rows</div>
            <Button
              className="btn btn-success"
              onClick={updateRow}
              disabled={!editChart}
              value={-1}
            >
              -
                </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
