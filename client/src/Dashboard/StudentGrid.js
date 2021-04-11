
import React, {useState} from 'react';

import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from "react-grid-dnd";
import { DashboardContext } from '../contexts';
import StudentBehaviorModal from "./StudentBehaviorModal.js"


export default function StudentGrid({students, setStudents, size, edit}){
    const [modalOpen, setModalOpen] = useState(false);
    const [student, setStudent] = useState();
  // target id will only be set if dragging from one dropzone to another.
  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    const nextState = swap(students, sourceIndex, targetIndex);
    setStudents(nextState);
  }

  function handleStudentClick(e){
    const name = e.target.innerText;
    const student = students.filter((s) => {
      return s.name === name;
    });
    setStudent(student)
    setModalOpen(true);
  }
  const closeModal = () => setModalOpen(false);


  return (
    <>

    <GridContextProvider onChange={onChange}>
      <GridDropZone
        id="items"
        className="dropzone"
        boxesPerRow={6}
        rowHeight={100}
        disableDrag = {edit}
        disableDrop = {edit}
        style = {{height: size}}
      >
      {students && students.length ? (
        students.map(item => (
          <GridItem key={item.id}>
              <div className = "btn grid-item"  onClick = {edit ? handleStudentClick : null} >
                  <div className = "tile" >{item.name}</div>
              </div>

          </GridItem>
        )) ) : <></>}
      </GridDropZone>
    </GridContextProvider>

    {modalOpen && <StudentBehaviorModal open={modalOpen} onClose={closeModal} students = {students} setStudents = {setStudents} student = {student}/>}
    </>
  )
}
