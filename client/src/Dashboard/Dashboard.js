import React, {useState} from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);


export default function Dashboard () {
    const [students, setStudents] = useState(["First, Last 1", "First, Last 2", "First, Last 3", "First, Last 4", "First, Last 5", 
    "First, Last 6", "First, Last 7", "First, Last 8", "First, Last 9", "First, Last 10",  "First, Last 11", "First, Last 12", "First, Last 13",
    "First, Last 14", "First, Last 15", "First, Last 16", "First, Last 17", "First, Last 18", "First, Last 19", "First, Last 20", "First, Last 21", 
    "First, Last 22", "First, Last 23", "First, Last 24", "First, Last 25", "First, Last 26", "First, Last 27", "First, Last 28", "First, Last 29",
    "First, Last 30", "First, Last 31", "First, Last 32", "First, Last 33", "First, Last 34", "First, Last 35", "First, Last 36"]);
    const layout = [
      {x:0, y: 0, w: 1, h: 1},
      {x:1, y: 0, w: 1, h: 1},
      {x:2, y: 0, w: 1, h: 1},
      {x:3, y: 0, w: 1, h: 1},
      {x:4, y: 0, w: 1, h: 1},
      {x:5, y: 0, w: 1, h: 1},
      {x:0, y: 1, w: 1, h: 1},
      {x:1, y: 1, w: 1, h: 1},
      {x:2, y: 1, w: 1, h: 1},
      {x:3, y: 1, w: 1, h: 1},
      {x:4, y: 1, w: 1, h: 1},
      {x:5, y: 1, w: 1, h: 1},
      {x:0, y: 2, w: 1, h: 1},
      {x:1, y: 2, w: 1, h: 1},
      {x:2, y: 2, w: 1, h: 1},
      {x:3, y: 2, w: 1, h: 1},
      {x:4, y: 2, w: 1, h: 1},
      {x:5, y: 2, w: 1, h: 1},
      {x:0, y: 3, w: 1, h: 1},
      {x:1, y: 3, w: 1, h: 1},
      {x:2, y: 3, w: 1, h: 1},
      {x:3, y: 3, w: 1, h: 1},
      {x:4, y: 3, w: 1, h: 1},
      {x:5, y: 3, w: 1, h: 1},
      {x:0, y: 4, w: 1, h: 1},
      {x:1, y: 4, w: 1, h: 1},
      {x:2, y: 4, w: 1, h: 1},
      {x:3, y: 4, w: 1, h: 1},
      {x:4, y: 4, w: 1, h: 1},
      {x:5, y: 4, w: 1, h: 1},
      {x:0, y: 5, w: 1, h: 1},
      {x:1, y: 5, w: 1, h: 1},
      {x:2, y: 5, w: 1, h: 1},
      {x:3, y: 5, w: 1, h: 1},
      {x:4, y: 5, w: 1, h: 1},
      {x:5, y: 5, w: 1, h: 1},
      
    ]

    
    return (
      <div className = "grid">
        <ResponsiveGridLayout
          className="layout"
          layout = {layout}
          breakpoints={{ lg: 1200 }}
          cols={{ lg: 6 }}
          // rows={{lg: 6}}
          // height={100}
          // width={100}
        >
            {
                students.map((s) =>{
                    return (
                  
                      <div key={s} className="tile">
                        {s}
                      </div>
             
                    );
                })
            }
         
        </ResponsiveGridLayout>
      </div>
    );
  }
