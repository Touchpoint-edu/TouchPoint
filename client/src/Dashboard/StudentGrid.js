
import React, {useEffect, useState} from 'react';
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from "react-grid-dnd";
import StudentBehaviorModal from "./StudentBehaviorModal.js"
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Seat from './Seat.js';



export default function StudentGrid({students, setStudents, size, edit, handle1, rows, cols}){
    const [modalOpen, setModalOpen] = useState(false);
    const [student, setStudent] = useState();
    const [empty, setEmpty] = useState([]);
    const [colsize, setcolsize] = useState("0px");
    const [rowsize, setrowsize] = useState("0px");
    const [emptyNum, setEmptyNum] = useState(0);
    const backgroundRef = React.createRef();
    console.log(rows);
    useEffect(()=> {
      console.log(emptyNum);
      setEmpty([]);
      for (let i = 0; i < emptyNum; i++) {
        const item = {
          id: i,
        }
        setEmpty(prev => [
          ...prev,
          <Seat rowSize={rowsize} colSize={colsize} empty={true} item={item}></Seat>
        ]);
      }
    }, [emptyNum, rowsize, colsize]);
    useEffect(() => {
      function updateRectSizes() {
        if (backgroundRef.current) {
          const rect = backgroundRef.current.getBoundingClientRect();
          console.log("WIDTH", rect.width);
          const width = rect.width / cols;
          const height = rect.height / rows;
          setcolsize(`${width}px`);
          setrowsize(`${height}px`);
        }
      }
      updateRectSizes();
      setEmptyNum(rows*cols - students.length);
      window.addEventListener('resize', updateRectSizes);
      return () => window.removeEventListener('resize', updateRectSizes);
    }, [backgroundRef, cols, rows, students.length])
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

  function getSize() {
    console.log(backgroundRef.current.offsetWidth);
  }


  return (
    <div id="dropzone" ref={backgroundRef} className="dropzone mh-100">
      {students.length && (
        students.map(item => (
          <Seat rowSize={rowsize} colSize={colsize} item={item} handleStudentClick={handleStudentClick} editMode={edit}/>

        )) ) }
      { empty }
    </div>
  )
}
