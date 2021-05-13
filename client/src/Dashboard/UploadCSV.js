import React, { useState, useContext } from "react";
import { CSVReader } from 'react-papaparse'
import { MDBTable, MDBTableBody } from 'mdbreact';
import { DataStoreContext } from "../contexts.js";
import { uploadCSV } from "../api/class_period";
import Button from "../Components/Button";

export default function UploadCSV(props) {
  const {reload, setReload} = useContext(DataStoreContext);

  const [parsedFile, setParsedFile] = useState("")
  const [csvError, setCsvError] = useState(false)
  const [isUploadBtn, setUploadBtn] = useState(true) // two btns: upload and confirm

  const handleOnDrop = (fileContent) => {
    setCsvError("")
    setParsedFile(fileContent.map(content => content.data))
  }

  const handleBtnUpload = () => {
    setUploadBtn(false)
  }

  const handleBtnConfirm = async () => {
    const response = await uploadCSV(parsedFile, props.periodNum - 1);
    
    if (response.status === 200) {
      setReload(!reload)
      props.handleModalClose()
    } else {
      const responseData = await response.json();
      alert(responseData.message)
      setParsedFile()
      setUploadBtn(true)
    }
  }

  const UploadArea =
    <CSVReader
      style={{
        dropFile: {
          width: 100,
          height: 120,
          background: '#ccc',
        },
        fileNameInfo: {
          width: 100,

        },
        fileSizeInfo: {
          display: "none",
        },
      }}
      className="text-wrap"
      noProgressBar
      addRemoveButton
      onDrop={handleOnDrop}
      onError={() => setCsvError("There has been an error. Please try a different file.")}
      onRemoveFile={() => setParsedFile()}
    >
      {csvError && <span className="text-red-500">{csvError}</span>}
      <img src="upload.png" alt="upload" className="mt-2 mb-5" />
      <span>Drop CSV file here or click to upload.</span>
    </CSVReader>

  const StudentList =
    <>
      <h5 className="mb-3">Is this the file you wish to upload?</h5>
      <MDBTable scrollY striped responsive small>
        <MDBTableBody rows={parsedFile} />
      </MDBTable>
      <div className="text-red-500 mt-4">If you currently have a seating chart for period {props.periodNum}, this will overwrite it. Do you wish to continue?</div>
    </>

  return (
    <>
      {isUploadBtn ? UploadArea : StudentList}

      <hr className="solid my-4" />

      <Button
        className="submit_button w-100"
        onClick={isUploadBtn ? handleBtnUpload : handleBtnConfirm}
        disabled={!parsedFile}
      >
        {isUploadBtn ? "Upload" : "Confirm"}
      </Button>
    </>
  );
}