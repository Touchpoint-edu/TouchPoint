import React, { useEffect, useState, useContext } from "react";
import Button from "../Components/Button";
import Modal from "../Components/Modal";
import { Container, Row, Col, Form, Spinner, } from "react-bootstrap";
import { downloadCSV } from '../api/class_period';
import UploadCSV from "./UploadCSV"
import { CSVDownloader } from 'react-papaparse'

function getEpoch(dateString) {
  const dateArray = dateString.split('-')

  let year = dateArray[0]
  let month = dateArray[1] - 1
  let day = dateArray[2]

  return new Date(year, month, day).getTime() / 1000
}

export default function UploadDownloadModal({ open, variant, onClose, curPeriodStudents, period }) {
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

  // const { periods, setPeriods } = useContext(DashboardContext);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDownloadLoading, setDownloadLoading] = useState(false)
  const [downloadBlankInput, setDownloadBlankInput] = useState(false);
  const [downloadErrMsg, setDownloadErrMsg] = useState("");

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

    const response = await downloadCSV(curPeriodStudents, startEpoch, endEpoch);

    if (response.status === 200) {
      //Possible error: If file size is too large 
      await response.blob().then(blob => {
        console.log(blob)
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'period.csv';
        a.click();
      });
    } else {
      const resData = await response.json()
      setDownloadErrMsg("An error has occured. Please try again later.")
    }

    setDownloadLoading(false)
    // onClose()
  }

async function returnDownloadData(){
    let data=[
      {
        "Column 1": "1-1",
        "Column 2": "1-2",
        "Column 3": "1-3",
        "Column 4": "1-4",
      }]
    return data;
  }

  

  return (
    <Modal title={variant} open={open} onClose={() => { onClose() }}>
      <div className="modal-body px-5 mh-100 overflow-auto">
        {variant === "upload" ? (
          <UploadCSV periodNum={period + 1} handleModalClose={onClose} />
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
                  <Form.Control type="date" value={endDate} onChange={e => { setEndDate(e.target.value) }} />
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
            <CSVDownloader
              data={returnDownloadData()}
              bom={true}
              type="button"
            >
              Download
            </CSVDownloader>
          </>
        )}
      </div>
    </Modal>
  );
}