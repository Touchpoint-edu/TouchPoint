
import React, {useEffect, useState} from 'react';
import Spot from './Spot.js';

export default function StudentGrid({fullScreenMode, students, edit, rows, cols, updatePos, periodsArray, selectedPeriod}){
    const [spots, setSpots] = useState([]);
    const [colsize, setcolsize] = useState("0px");
    const [rowsize, setrowsize] = useState("0px");
    const backgroundRef = React.createRef();
    console.log("Rerender?");
    useEffect(()=> {
      const newSpots = [];
      let key = 0;
      students.forEach((student) => {
        const seatSize = {
          row: rowsize,
          col: colsize
        }
        newSpots.push(<Spot key={key} fullScreenMode={fullScreenMode} editMode={edit} updatePos={updatePos} seatSize={seatSize} item={student}
          curPeriod = {periodsArray[selectedPeriod]} />);
        key++;
      });
      setSpots(newSpots);
    }, [edit, fullScreenMode, students, rowsize, colsize, updatePos]);

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
