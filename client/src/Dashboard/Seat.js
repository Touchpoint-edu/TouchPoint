export default function Seat({editMode, rowSize, colSize, item, handleStudentClick, empty}) {
    const dragStart = e => {
        console.log("dragging!");
        const target = e.target;
        e.dataTransfer.setData("itemId", target.id);
        setTimeout(() => {
            target.style.display = "none";
        }, 0);

    }
    const gridDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    }
    const itemDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    }
    const drop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const itemId = e.dataTransfer.getData("itemId");
        const item = document.getElementById(itemId);
        if (e.currentTarget.hasChildNodes() && (e.currentTarget.children[0].id !== itemId)) {
            const childId = e.currentTarget.children[0].id;
            const child = document.getElementById(childId);
            item.parentNode.appendChild(child);
        }
        item.remove();
        item.style.display = "flex";
        e.currentTarget.appendChild(item);
    }

    return(
        <div style={{width: colSize, height: rowSize}} className="item" key={item.id}>
              <div onDrop={drop} onDragOver={gridDragOver} className = "grid-item"  onClick = { editMode ? handleStudentClick : null} >
                  { !empty &&
                      <div id={item.id} draggable={!editMode} onDragStart={dragStart} onDragOver={itemDragOver} className="tile" >{item.name}</div>
                  }
              </div>

          </div>
    );
}