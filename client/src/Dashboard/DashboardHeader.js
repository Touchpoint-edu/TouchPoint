import React, { useContext, useState, useEffect } from "react";
import Button from "../Components/Button";
import UploadDownloadModal from "./UploadDownloadModal";
import { DataStoreContext, DashboardContext } from "../contexts.js";


export default function DashboardHeader({students, setStudents}) {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalVariant, setModalVariant] = useState("upload");
    const [periods, setPeriods] = useState([]);
    const openModal = (variant) => {
        setModalVariant(variant);
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);
    useEffect(() => {
       //API call to get all the periods for the teacher
        //setPeriods(responsedata)
    
    },[])
    const ps = [
        { id: 0, value: "Period 1" },
        { id: 1, value: "Period 2" },
        { id: 2, value: "Period 3" }
    ];
    const { user, setUser } = useContext(DataStoreContext);
    // const [students, setStudents] = useState();
    // const [periods, setPeriods] = useState([]);
    //uncomments and add to dashboardcontext provider
    const [selectedPeriod, setSelectedPeriod] = useState("Periods");

    async function handlePeriodChange(event) {
        setSelectedPeriod(event.target.value);
        const response = await fetch("/students/seating/"+selectedPeriod, {
            method: "GET",
        })
        const responseData = await response.json()
        if (response.status === 200) {
            // set student array
            if (responseData) {
              // set the currecct period and its students
              setStudents(responseData.period.students)
            }
            // TODO: the rest
          } else if (response.status === 400) {
            // TODO: put out error message from responseData
            console.log(responseData)
          } else if (response.status === 500) {
            // TODO: put out error message from responseData
            console.log(responseData)
          }
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
                {ps.map((per) => {
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
                students = {students}
                setStudents = {setStudents}
                toggleVariant={() =>
                setModalVariant(modalVariant === "upload" ? "upload" : "download")
            }
            />}
        </div>
        
    </div>
    </DashboardContext.Provider>);
}