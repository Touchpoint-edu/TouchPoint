
import React, {useEffect, useState} from 'react';
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from "react-grid-dnd";
import StudentBehaviorModal from "./StudentBehaviorModal.js"
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Spot from './Spot.js';



export default function StudentGrid({fullScreenMode, students, setStudents, size, edit, handle1, rows, cols, updatePos}){
    const [modalOpen, setModalOpen] = useState(false);
    const [student, setStudent] = useState();
    const [spots, setSpots] = useState([]);
    const [colsize, setcolsize] = useState("0px");
    const [rowsize, setrowsize] = useState("0px");
    const backgroundRef = React.createRef();
    useEffect(()=> {
      setSpots([]);
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const found = students.find(student => {
            return student.row === i && student.col === j && !!student.name;
          });
          
          const posObj = {
            row: i,
            col: j
          }
          const seatSize = {
            row: rowsize,
            col: colsize
          }
          setSpots(prev => [
            ...prev,
            <Spot fullScreenMode={fullScreenMode} editMode={edit} updatePos={updatePos} seatSize={seatSize} item={found} id={i*cols + j} pos={posObj} />
          ]);
        }
      }
    }, [rowsize, colsize, rows, cols, students, updatePos, edit, fullScreenMode]);

    useEffect(() => {
      function updateRectSizes() {
        if (backgroundRef.current) {
          const rect = backgroundRef.current.getBoundingClientRect();
          const width = rect.width / cols;
          const height = rect.height / rows;
          setcolsize(`${width}px`);
          setrowsize(`${height}px`);
        }
      }
      updateRectSizes();
      window.addEventListener('resize', updateRectSizes);
      return () => window.removeEventListener('resize', updateRectSizes);
    }, [backgroundRef, cols, rows, students.length]);


  return (
    <div id="dropzone" ref={backgroundRef} className="dropzone h-100">
      { spots }
    </div>
  )
}
