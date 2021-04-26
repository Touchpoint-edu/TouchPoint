import React, { useEffect, useState, useContext } from "react";
import Button from "../Components/Button";
import Modal from "../Components/Modal";
import { DataStoreContext } from "../contexts.js";
import { uploadCSV, createPeriod } from "../api/class_period";
import { Container, Row, Col, Form, Spinner, } from "react-bootstrap";
import { downloadCSV } from '../api/class_period';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';


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
  const [parsedPeriod, setParsedPeriod] = useState();
  const [uploadValidation, setUploadValidation] = useState("");
  const [confirm, setConfirm] = useState(false);
  // const { periods, setPeriods } = useContext(DashboardContext);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDownloadLoading, setDownloadLoading] = useState(false)
  const [downloadBlankInput, setDownloadBlankInput] = useState(false);
  const [downloadErrMsg, setDownloadErrMsg] = useState("");

  // Handles file upload event and updates state
  async function handleUpload(event) {
    if (event.target.files[0] && event.target.files[0].type === "text/csv") {
      setUploadFile(event.target.files[0]);
    }
    else {
      setUploadValidation("Currently, only .csv files are accepted. Please upload a csv file to continue.");
    }
  }

  async function handleDownload() {
    setDownloadLoading(true)
    setDownloadBlankInput(false)
    setDownloadErrMsg(false)

    // return if user didn't select date range
    if (!startDate || !endDate) {
      setDownloadBlankInput(true)
      setDownloadLoading(false)
      return
    }

    const startEpoch = getEpoch(startDate)
    const endEpoch = getEpoch(endDate)

    // return if user selected a date in the future
    if (startEpoch > Date.now / 1000) {
      setDownloadErrMsg("Invalid start date.")
      setDownloadLoading(false)
      return
    }

    // return if user selected a start date that's later than end date
    if (startEpoch > endEpoch) {
      setDownloadErrMsg("Start date needs to be before end date.")
      setDownloadLoading(false)
      return
    }

    const response = await downloadCSV(students, startEpoch, endEpoch);

    if (response.status === 200) {

    } else {
      const resData = await response.json()
      setDownloadErrMsg("An error has occured. Please try again later.")
    }

    setDownloadLoading(false)
    // onClose()
  }

  async function handleSubmitUpload(e) {
    const response = await uploadCSV(uploadFile, period);

    if (response.status === 200) {
      const responseData = await response.json();

      setParsedPeriod(responseData.period)
      setConfirm(true);
    } else {
      alert("An error has occured. Please try again.")
    }
  }

  async function handleConfirmUpload(e) {
    if (!!uploadFile) {
      const response = await createPeriod(parsedPeriod);
      if (response.status === 200) {
        setReload(!reload);

        onClose();
      } else {
        alert("An error has occured. Please try again.")
      }
    }
  }

  const displayStudents = () => (
    <>
      <h5 className="mb-3">Found {parsedPeriod.students.length} students from file:</h5>
      <MDBTable scrollY striped maxHeight="300px">
        <MDBTableHead columns={[{ label: "" }, { label: "Name" }, { label: "Email" }]} />
        <MDBTableBody rows={parsedPeriod.students.map((student, index) => ({ "#": index + 1, name: student.name, email: student.email }))} />
      </MDBTable>
    </>
  )

  return (
    <Modal title={variant} open={open} onClose={() => { setParsedPeriod(null); onClose() }}>
      <div className="modal-body px-5 mh-100 overflow-auto">
        {variant === "upload" ? (
          <>
            {!parsedPeriod &&
              <div className="text-center">
                <img src="upload.png" alt="upload" className="mt-2 mb-5" />
                <input type="file" encType="multipart/form-data" className="file-uploader mb-3" onChange={handleUpload} accept=".csv" disabled={confirm} />
                <div className="text-red-500">{uploadValidation}</div>
              </div>
            }

            {parsedPeriod && displayStudents()}

            {confirm && <div className="text-red-500">If you currently have a seating chart for period {period + 1}, this will overwrite it. Do you wish to continue?</div>}

            <hr className="solid my-4" />
            {confirm ?
              <Button
                className="submit_button w-100"
                fullWidth={true}
                onClick={handleConfirmUpload}
                onClose={onClose}
              >
                Confirm
              </Button>
              :
              <Button
                className="submit_button w-100"
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
                  {downloadBlankInput && !startDate && <p className="text-red-500 mt-2">Start date required.</p>}
                </Col>

                <Col>
                  <h5 className="text-muted order-md-2">End Date</h5>
                  <Form.Control type="date" value={endDate} onChange={e => { setEndDate(e.target.value)}} />
                  {downloadBlankInput && !endDate && <p className="text-red-500 mt-2">End date required.</p>}
                </Col>
              </Row>
              <Row>{downloadErrMsg && <p className="text-red-500 mt-2 mb-0 ml-3">{downloadErrMsg}</p>}</Row>
            </Container>

            <hr className="mb-4" />
            <Button
              className="submit_button w-100"
              fullWidth={true}
              onClick={handleDownload}
              onClose={onClose}
            >
              {isDownloadLoading ? <Spinner animation="border" variant="light" size="sm" /> : "Download"}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}