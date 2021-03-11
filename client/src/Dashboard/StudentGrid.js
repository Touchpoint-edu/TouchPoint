import React, {useState, useContext, useEffect} from 'react';
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from "react-grid-dnd";
import { DashboardContext } from '../contexts';

export default function StudentGrid({students, setStudents}){
 
 
 const [size, setSize] = useState((students.length/6)*100)
  // target id will only be set if dragging from one dropzone to another.
  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    const nextState = swap(students, sourceIndex, targetIndex);
    setStudents(nextState);
  }


  return (
    <GridContextProvider onChange={onChange}>
      <GridDropZone
        id="items"
        className="dropzone"
        boxesPerRow={6}
        rowHeight={100}
        style = {{height: size}}
      >
      {students && students.length ? (
        students.map(item => (
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
  )
}