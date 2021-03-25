import React, { useContext, useState, useEffect } from "react";
import Button from "../Components/Button";
import UploadDownloadModal from "./UploadDownloadModal";
import { DataStoreContext, DashboardContext } from "../contexts.js";


export default function DashboardHeader() {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalVariant, setModalVariant] = useState("upload");
    const openModal = (variant) => {
        setModalVariant(variant);
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const periods = [
        { id: 0, value: "Period 1" },
        { id: 1, value: "Period 2" },
        { id: 2, value: "Period 3" }
    ];
    const { user, setUser } = useContext(DataStoreContext);
    const [students, setStudents] = useState();
    // const [periods, setPeriods] = useState([]);
    //uncomments and add to dashboardcontext provider
    const [selectedPeriod, setSelectedPeriod] = useState("Periods");

    function handlePeriodChange(event) {
        // API Call
        // const newStudents 
        // setStudents(newStudents);
        setSelectedPeriod(event.target.value);
    }


    return (
    <DashboardContext.Provider value = {{selectedPeriod, setSelectedPeriod, students, setStudents}}>
    <div className = "d-flex">
        <div className = "p-2 ml-5 flex-grow-1">
            <div className = "mb-2 ml-5">
                <span className = "dash_title">{user}'s Classroom</span>
            </div>
            <div>
            <select
                className="form-control w-25 ml-5"
                value={selectedPeriod}
                onChange={handlePeriodChange}
                >
                {periods.map((per) => {
                    return (
                    <option key={per.id} value={per.value}>
                        {per.value} 
                    </option>
                    );
                })}
            </select>
            
            </div>
        </div>
        <div className = "ml-4 mt-1 dash_header_buttons">
            <div className = "mb-2">
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
                        toggleVariant={() =>
                            setModalVariant(modalVariant === "upload" ? "upload" : "download")
                        }
                    />}

                </div>

            </div>
            {modalOpen && <UploadDownloadModal
                open={modalOpen}
                onClose={closeModal}
                variant={modalVariant}
                toggleVariant={() =>
                setModalVariant(modalVariant === "upload" ? "upload" : "download")
            }
            />}
        </div>
        
    </div>
    </DashboardContext.Provider>);
}