import React, { useContext, useState, useEffect } from "react";
import Button from "../Components/Button";
import UploadDownloadModal from "./UploadDownloadModal";
import EditPeriodModal from "./EditPeriodModal";
import { DataStoreContext, DashboardContext } from "../contexts.js";

const NUM_OF_PERIODS = 8;

export default function DashboardHeader({ students, curPeriodStudents, setStudents, periodsArray }) {

    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalVariant, setModalVariant] = useState("upload");
    const [periods, setPeriods] = useState([]);
    const { user, setUser, selectedPeriod, setSelectedPeriod} = useContext(DataStoreContext);
    const openModal = (variant) => {
        setModalVariant(variant);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);
    useEffect(() => {
        const periodOptions = [];
        for (let i = 0; i < NUM_OF_PERIODS; i++) {
            periodOptions.push({
                id: i,
                name: `Period ${i + 1}`
            })
        }
        setPeriods(periodOptions);
    }, []);

    function openEditModal() {
        setEditModalOpen(true);
    }

    const closeEditModal = () => setEditModalOpen(false);
    // const [students, setStudents] = useState();
    // const [periods, setPeriods] = useState([]);
    //uncomments and add to dashboardcontext provider

    function handlePeriodChange(event) {
        setSelectedPeriod(parseInt(event.target.value));
    }


    return (
        // <DashboardContext.Provider value = {{selectedPeriod, setSelectedPeriod, students, setStudents}}>
        <div className="d-flex justify-content-between">
            <div className="p-2 flex-grow-1">
                <div className="mb-2 action d-flex justify-content-flex-start mr-3">
                    <span className="mr-4 dash_title">{user}'s Classroom</span>
                    <Button className="edit_period_button" onClick={openEditModal} >
                            Edit Period Name
                    </Button>
                </div>
                <div>
                    
                </div>
                <div className="d-flex flex-column justify-content-center">
                    <select
                        className="form-control w-50"
                        value={selectedPeriod}
                        onChange={handlePeriodChange}
                    >
                        {periods.map((per) => {
                            return (
                                <option key={per.id} value={per.id}>
                                    {per.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                {/* <div className="mr-2">
                    <Button className="mr-1 edit_period_button" onClick={() => openEditModal()} >
                        Edit Period Name
                    </Button>
                </div> */}
            </div>
            <div>
                <div className="mb-2">
                    <Button className="mr-1 import_button" onClick={() => openModal("upload")} >
                        + Upload CSV
                </Button>
                </div>
                <div>
                    <Button className="export_button" onClick={() => openModal("download")} >
                        - Download CSV
                </Button>
                </div>
                {modalOpen && <UploadDownloadModal
                    open={modalOpen}
                    onClose={closeModal}
                    variant={modalVariant}
                    students={students}
                    setStudents={setStudents}
                    curPeriodStudents = {curPeriodStudents}
                    periodArray={periodsArray}
                    toggleVariant={() =>
                        setModalVariant(modalVariant === "upload" ? "upload" : "download")
                    }
                    period={selectedPeriod}
                />}

                {editModalOpen && <EditPeriodModal 
                    open={editModalOpen} 
                    onClose={closeEditModal}
                    period={selectedPeriod}
                    />}
            </div>

        </div>
        // </DashboardContext.Provider>
    );
}