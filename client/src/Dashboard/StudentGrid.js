
import React, {useState} from 'react';
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from "react-grid-dnd";
import StudentBehaviorModal from "./StudentBehaviorModal.js"
import { FullScreen, useFullScreenHandle } from "react-full-screen";



export default function StudentGrid({students, setStudents, size, edit, handle1, cols}){
    const [modalOpen, setModalOpen] = useState(false);
    const [student, setStudent] = useState();
  // target id will only be set if dragging from one dropzone to another.
  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    const nextState = swap(students, sourceIndex, targetIndex);
    setStudents(nextState);
  }

  const handle2 = useFullScreenHandle();
  function handleStudentClick(e){
    const name = e.target.innerText;
    const student = students.filter((s) => {
      return s.name === name;
    });
    setStudent(student);
    if(handle1.active){
      handle2.enter();
      setModalOpen(true);
    } else {
      setModalOpen(true);
    }
    
  }
  function closeModal(){
    setModalOpen(false);
    if(handle2.active){
      handle2.exit();
      handle1.enter();
    }
  }


  return (
    <>
    
    <GridContextProvider onChange={onChange}>
      <GridDropZone
        id="items"
        className="dropzone"
        boxesPerRow={cols}
        rowHeight={100}
        disableDrag = {edit}
        disableDrop = {edit}
        style = {{height: size}}
      >
      {students && students.length ? (
        students.map(item => (
          <GridItem className="item" key={item.id}>
              <div className = "btn grid-item"  onClick = { edit ? handleStudentClick : null} >
                  <div className = "tile" >{item.name}</div>
              </div>

          </GridItem>
        )) ) : <></>}
      </GridDropZone>
    </GridContextProvider>

    {modalOpen && <StudentBehaviorModal open={modalOpen} onClose={closeModal} students = {students} setStudents = {setStudents} student = {student} handle2={handle2}/>}
    </>
  )
}
