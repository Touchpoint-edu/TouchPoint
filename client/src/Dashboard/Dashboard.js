import React, { useState, useEffect } from "react";
import StudentGrid from "./StudentGrid.js";
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import AddStudentForm from "./AddStudentForm"


export default function Dashboard() {


  const [students, setStudents] = useState([
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

  const [size, setSize] = useState((students.length / 6) * 100)
  const [editChart, setEditChart] = useState(false);

  function handleChartSave() {
    if (editChart == false) {
      //save the chart
    }
    setEditChart(!editChart);
  }

  return (
    <>
      <div className="dash">
        <div className="add-button-container ">
          <AddStudentForm students={students} setStudents={setStudents}></AddStudentForm>
        </div>

        <div className="grid-container">
          <StudentGrid students={students} setStudents={setStudents} size={size} edit={editChart}></StudentGrid>
        </div>

        <div className="edit-button-container">
          <Button
            className="edit-button btn btn-success mt-1"
            onClick={handleChartSave}
          >
            {editChart ? (<>Edit Seating</>) : (<>Save Seating</>)}
          </Button>
        </div>
      </div>
    </>
  );
}
