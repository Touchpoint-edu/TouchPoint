import React, { useEffect, useState, useContext } from "react";
import Close from "../Components/Close";
import { createPortal } from "react-dom";
import Button from "../Components/Button";
import { DashboardContext } from "../contexts.js";



const modalContainer = document.getElementById("modal-container");

export default function UploadDownloadModal({ open, variant, onClose }) {
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
  const [studentList, setStudentList] = useState();
  const { students, setStudents } = useContext(DashboardContext);
  const { selectedPeriod, setSelectedPeriod } = useContext(DashboardContext);
  // const { periods, setPeriods } = useContext(DashboardContext);

  // Handles file upload event and updates state
  function handleUpload(event) {
    setUploadFile(event.target.files[0]);
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

    if (!uploadFile) {
      // TODO: put out error message for no file chosen
      return;
    }

    // make FormData object to pass into request
    const formData = new FormData()
    formData.append('file', uploadFile)

    // fetch to save csv to database
    const response = await fetch("/period/csv/upload", {
      method: "POST",
      body: formData
    })
    const responseData = await response.json()

    if (response.status === 200) {
      // set student array
      if (responseData && responseData.period) {
        console.log(responseData.period)

        const newPeriod = {
          id: responseData.period._id,
          // value: "Period " + (periods.length + 1)
        }

        // set the currecct period and its students
        setStudents(responseData.period.students)
        // setPeriods([...periods, newPeriod])
        // setSelectedPeriod(newPeriod.value)
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

  async function handleSubmitDownload(e) {
    e.preventDefault();
    onClose();
  }
  async function handleConfirmUpload(e) {
    console.log("hiiiii")
    e.preventDefault();

    onClose();
  }

  return createPortal(
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal" tabIndex="-1" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content pb-3" onClick={stopPropagation}>
            <div className="d-flex justify-content-end mr-3 mt-3 ">
              <div className="invisible " onClick={onClose}>
                <Close />
              </div>
              <div className="modal-close cursor-pointer z-50" onClick={onClose}>
                <Close />
              </div>
            </div>
            <div>
              {variant === "upload" ? (
                <>
                  {students ?
                    <div className="student-modal">
                      <div className="mt-8 d-flex justify-content-start ml-5 modal-header-text">
                        <h2>upload</h2>
                      </div>
                      <div scrollable={"true"}>
                        <ul className="list-group ml-5 mr-5">
                          {students.map((student) => {
                            console.log(student);
                            return (<li className="list-group-item">{`${student.name}, ${student.email}`}</li>)
                          })}
                        </ul>
                      </div>
                      <Button
                          className="h-12 w-75 text-xl submit_button ml-5 mt-2 mb-2"
                          fullWidth={true}
                          onSubmit = {handleConfirmUpload}
                          onClose = {onClose}
                      >
                        Confirm
                      </Button>
                    </div> :
                    <>
                      <div className="mt-8 d-flex justify-content-start ml-5 modal-header-text">
                        <h2>upload</h2>
                      </div>
                      <div className="upload-box">
                        <img src="upload.png" alt="upload" className="mt-2 mb-5" />
                        <input type="file" encType="multipart/form-data" className="file-uploader mb-3" onChange={handleUpload} />
                      </div>
                      <hr className="solid my-4" />
                      <Button
                        className="h-12 text-xl submit_button ml-5 mt-2 mb-2"
                        fullWidth={true}
                        // onSubmit = {handleSubmitUpload}
                        onClose={onClose}
                        onClick={handleSubmitUpload}
                      >
                        Upload
                      </Button>
                    </>
                  }

                </>
              ) : (
                <>
                  <div className="mt-8 d-flex justify-content-start ml-5 modal-header-text">
                    <h2>download</h2>
                  </div>
                  <div className="upload-box">
                    <img src="download.png" alt="download" className="mt-2 mb-5" />;
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
          </div>
        </div>
      </div>
    </>
    ,
    modalContainer
  );
}

