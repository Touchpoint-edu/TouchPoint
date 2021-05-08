
import React, {useEffect, useState} from 'react';
import Spot from './Spot.js';

export default function StudentGrid({fullScreenMode, students, edit, rows, cols, updatePos}){
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
        newSpots.push(<Spot key={key} fullScreenMode={fullScreenMode} editMode={edit} updatePos={updatePos} seatSize={seatSize} item={student} />);
        key++;
      });
      setSpots(newSpots);
    }, [edit, fullScreenMode, students, rowsize, colsize, updatePos]);

    useEffect(() => {
      function updateRectSizes() {
          const width = 100 / cols;
          const height = 100 / rows;
          setcolsize(`${width}%`);
          setrowsize(`${height}%`);
      }
      updateRectSizes();
      window.addEventListener('resize', updateRectSizes);
      return () => window.removeEventListener('resize', updateRectSizes);
    }, [cols, rows, students.length]);


  return (
    <div id="dropzone" className="dropzone h-100">
      { spots }
    </div>
  )
}
