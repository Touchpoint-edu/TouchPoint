import React, { useEffect, useState, useContext } from "react";
import Button from "../Components/Button";
import Modal from "../Components/Modal";
import { Container, Row, Col, Form, Spinner, } from "react-bootstrap";
import { downloadCSV } from '../api/class_period';
import UploadCSV from "./UploadCSV"
import { CSVDownloader } from 'react-papaparse'
export default function UploadDownloadModal({ open, onClose, period }) {
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


  return (
    <Modal title={"Edit Period Name"} open={open} onClose={() => { onClose() }}>
      <div className="modal-body px-5 mh-100 overflow-auto">
      <form action="signup.html" method="post" id="signup">
        <div className="input">
            <label className="mr-2">Period Name</label>
            <input type="text" id="name" name="name" placeholder="Enter new period name" />
            <small></small>
        </div>
    </form>
      </div>
    </Modal>
  );
}