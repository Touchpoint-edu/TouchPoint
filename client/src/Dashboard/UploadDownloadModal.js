import React, { useEffect, useState, useContext } from "react";
import Close from "../Components/Close";
import { createPortal } from "react-dom";
import Button from "../Components/Button";
import Modal from "../Components/Modal";
import { DataStoreContext } from "../contexts.js";
import { uploadCSV } from "../api/class_period";



const modalContainer = document.getElementById("modal-container");

export default function UploadDownloadModal({ open, variant, onClose, students, setStudents, period }) {
  const { reload, setReload } = useContext(DataStoreContext);
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.keyCode === 27 && open) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);

    return function cleanup() {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, onClose]);

  function stopPropagation(e) {
    e.stopPropagation();
  }
  // State to store uploaded file
  const [uploadFile, setUploadFile] = useState();
  const [downloadLoadfile, setDownloadFile] = useState("");
  const [uploadValidation, setUploadValidation] = useState("");
  const [confirm, setConfirm] = useState(false);
  // const { periods, setPeriods } = useContext(DashboardContext);

  // Handles file upload event and updates state
  function handleUpload(event) {
    if (event.target.files[0].type === "text/csv") {
      setUploadFile(event.target.files[0]);
    }
    else {
      setUploadValidation("Currently, only .csv files are accepted. Please upload a csv file to continue.");
    }
    // TODO: display file preview
  }

  // Handles file upload event and updates state
  function handleDownload(event) {
    setDownloadFile(event.target.files[0]);

    // Add code here to upload file to server
    // ...
  }
  
  async function handleSubmitUpload(e) {
    // e.preventDefault();
    //upload to database, - DONE
    // change period - COMMENTED
    //set the students array to student names - NOT DONE
    //setStudents - DONE
    //set the period of the uploaded csv - COMMENTED
    //setSelectedPeriod - COMMENTED
    setConfirm(true);
    // if (!uploadFile) {
    //   // TODO: put out error message for no file chosen
    //   return;
    // }
    // console.log(period);
    // const response = await uploadCSV(uploadFile, period);
    // console.log(response);

    // if (response.status === 200) {
    //   setReload(!reload);
    //   // set student array
    //   // if (responseData && responseData.period) {
    //   //   console.log(responseData.period)

    //   //   const newPeriod = {
    //   //     id: responseData.period._id,
    //   //     // value: "Period " + (periods.length + 1)
    //   //   }

    //   //   // set the currecct period and its students
    //   //   setStudents(responseData.period.students)
    //   //   // setPeriods([...periods, newPeriod])
    //   //   // setSelectedPeriod(newPeriod.value)
    //   // }
    //   // TODO: the rest
    // } else if (response.status === 400) {
    //   // TODO: put out error message from responseData
    //   // console.log(responseData)
    // } else if (response.status === 500) {
    //   // TODO: put out error message from responseData
    //   // console.log(responseData)
    // }
  }

  async function handleSubmitDownload(e) {
    e.preventDefault();
    onClose();
  }
  async function handleConfirmUpload(e) {
    if (!!uploadFile) {
      // TODO: put out error message for no file chosen
      const response = await uploadCSV(uploadFile, period);
      if (response.status === 200) {
        setReload(!reload);
        onClose();
        // set student array
        // if (responseData && responseData.period) {
        //   console.log(responseData.period)
  
        //   const newPeriod = {
        //     id: responseData.period._id,
        //     // value: "Period " + (periods.length + 1)
        //   }
  
        //   // set the currecct period and its students
        //   setStudents(responseData.period.students)
        //   // setPeriods([...periods, newPeriod])
        //   // setSelectedPeriod(newPeriod.value)
        // }
        // TODO: the rest
      } else if (response.status === 400) {
        // TODO: put out error message from responseData
        // console.log(responseData)
      } else if (response.status === 500) {
        // TODO: put out error message from responseData
        // console.log(responseData)
      }
      return;
    }
  }

  return (
      <Modal title={variant} open={open} onClose={onClose}>
        <div className="modal-body px-5 mh-100 overflow-auto">
      {variant === "upload" ? (
                <>
                      <div className="text-center">
                        <img src="upload.png" alt="upload" className="mt-2 mb-5" />
                        <input type="file" encType="multipart/form-data" className="file-uploader mb-3" onChange={handleUpload} accept=".csv" disabled={confirm}/>
                        <div className="text-red-500">{uploadValidation}</div>
                      </div>
                      {confirm && <div className="text-red-500">If you currently have a seating chart for period {period+1}, this will overwrite it. Do you wish to continue?</div> }
                      
                      <hr className="solid my-4" />
                      {confirm ? 
                        <Button
                        className="h-12 w-75 text-xl submit_button ml-5 mt-2 mb-2"
                        fullWidth={true}
                        onClick = {handleConfirmUpload}
                        onClose = {onClose}
                    >
                      Confirm
                    </Button>
                     :
                      <Button
                        className="h-12 text-xl submit_button mt-2 mb-2"
                        fullWidth={true}
                        onClose={onClose}
                        onClick={handleSubmitUpload}
                        disabled={!uploadFile}
                      >
                        Upload
                      </Button>
                  }

                </>
              ) : (
                <>
                  <div className="text-center">
                    <img src="download.png" alt="download" className="mt-2 mb-5" />
                    <input type="file" className="file-uploader mb-3" onChange={handleDownload} />
                  </div>
                  <hr className="solid my-4 w-75" />
                  <Button
                      className="h-12 text-xl w-75 submit_button ml-5 mt-2 mb-2"
                      fullWidth={true}
                      onSubmit = {handleSubmitDownload}
                      onClose = {onClose}
                  >
                      Download
                  </Button>

                </>
              )}
        </div>
      </Modal>
  );
}