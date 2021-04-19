import React, { useEffect, useState, useContext } from "react";
import Button from "../Components/Button";
import Modal from "../Components/Modal";
import { DataStoreContext } from "../contexts.js";
import { uploadCSV } from "../api/class_period";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { downloadCSV } from '../api/class_period';

function getEpoch(dateString) {
  const dateArray = dateString.split('-')

  let year = dateArray[0]
  let month = dateArray[1] - 1
  let day = dateArray[2]

  return new Date(year, month, day).getTime() / 1000
}

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDownloadLoading, setDownloadLoading] = useState(false)
  const [downloadSubmitError, setDownloadSubmitError] = useState(false);

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



  async function handleDownload() {
    setDownloadLoading(true);

    // return if user didn't select date range
    if (!startDate && !endDate) {
      setDownloadSubmitError(true);
      setDownloadLoading(false);
      return
    }

    const startEpoch = getEpoch(startDate)
    const endEpoch = getEpoch(endDate)
    // return if user selected a start date that's later than end date
    if (startDate > endEpoch) {
      setDownloadSubmitError(true);
      setDownloadLoading(false);
      return
    }

    const response = await downloadCSV(students, startEpoch, endEpoch);

    if (response.status === 200) {

    } else {
      setDownloadSubmitError(true);
    } 

    setDownloadLoading(false);
    onClose()
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
              <input type="file" encType="multipart/form-data" className="file-uploader mb-3" onChange={handleUpload} accept=".csv" disabled={confirm} />
              <div className="text-red-500">{uploadValidation}</div>
            </div>
            {confirm && <div className="text-red-500">If you currently have a seating chart for period {period + 1}, this will overwrite it. Do you wish to continue?</div>}

            <hr className="solid my-4" />
            {confirm ?
              <Button
                className="h-12 w-75 text-xl submit_button ml-5 mt-2 mb-2"
                fullWidth={true}
                onClick={handleConfirmUpload}
                onClose={onClose}
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
            <Container className="">
              <Row sm={2}>
                <Col className="mb-2">
                  <h5 className="text-muted order-md-1">Start Date</h5>
                  <Form.Control type="date" value={startDate} onChange={e => { setStartDate(e.target.value) }} />
                  {downloadSubmitError && !startDate && <p className="text-red-500 mt-2">Start date required.</p>}
                </Col>

                <Col>
                  <h5 className="text-muted order-md-2">End Date</h5>
                  <Form.Control type="date" value={endDate} onChange={e => { setEndDate(e.target.value); console.log((e.target.value)) }} />
                  {downloadSubmitError && !endDate && <p className="text-red-500 mt-2">End date required.</p>}
                </Col>
              </Row>
            </Container>

            <hr className="mb-4" />
            <Button
              className="submit_button w-100"
              fullWidth={true}
              onClick={handleDownload}
              onClose={onClose}
            >
              {isDownloadLoading ? <Spinner animation="border" variant="light" size="sm"/> : "Download"}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}