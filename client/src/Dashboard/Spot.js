import { useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import StudentBehaviorModal from "./StudentBehaviorModal";
import Modal from 'react-bootstrap/Modal';


export default function Spot({fullScreenMode, editMode, seatSize, item, id, updatePos, pos, curPeriod }) {
    const [modalOpen, setModalOpen] = useState(false);
    const handleFullScreen = useFullScreenHandle();
    const dragStart = e => {
        const target = e.target;
        e.dataTransfer.setData("itemId", target.id);

    }
    const gridDragOver = e => {
        e.preventDefault();
    }
    const drop = (e) => {
        console.log(e);
        e.preventDefault();
        const itemId = e.dataTransfer.getData("itemId");
        const posObj = {
            row: parseInt(e.currentTarget.getAttribute("data-row")),
            col: parseInt(e.currentTarget.getAttribute("data-col"))
        }
        updatePos(itemId, posObj);
    }

    function openModal() {
        if (!editMode) {
            setModalOpen(true);
            if (fullScreenMode) handleFullScreen.enter();
        }
    }
    function closeModal() {
        console.log("closing...");
        setModalOpen(!modalOpen);
        console.log(modalOpen);
    }

    return(
        <div style={{width: seatSize.col, height: seatSize.row}} className="item">
              <div id={id} onDrop={drop} onDragOver={gridDragOver} className = "grid-item" onClick={openModal} data-row={item.row} data-col={item.col}>
                  { !!item.name &&
                      <div id={item.email} draggable={editMode} onDragStart={dragStart} className="tile">{item.name}
                        <FullScreen handle={handleFullScreen}>
                            <StudentBehaviorModal open={modalOpen} onClose={closeModal} student={item} curPeriod={curPeriod} />
                        </FullScreen>
                        </div>
}
              </div>

          </div>
    );
}