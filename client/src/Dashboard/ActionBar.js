import { useState } from "react";
import { FormControl, InputGroup } from "react-bootstrap";
import Button from "../Components/Button";

export default function ActionBar({edit, updateRow, updateCol, handleSave, addStudent, addStudentValidation}) {
    const [studentName, setStudentName] = useState("");
    function handleNameChange(event) {
        setStudentName(event.target.value);
    }
    
    return (
        <div className="actions-cont col-lg-3 col-xl-2 d-none d-lg-flex flex-column">
          <div className="action">
            <Button
              className="edit-button btn btn-success"
              onClick={handleSave}
            >
              {edit ? (<>Save Seating</>) : (<>Edit Seating</>)}
            </Button>
          </div>
          { edit && 
          <div className="action">
            <form onSubmit={addStudent} >
              <InputGroup className="add-student">
                <FormControl
                  placeholder="Student Name"
                  aria-label="Student Name"
                  aria-describedby="basic-addon2"
                  value={studentName}
                  onChange={handleNameChange}
                  disabled={!edit}
                />
                <InputGroup.Append>
                  <Button className="add-button btn btn-success" disabled={!editChart} type="submit">+</Button>
                </InputGroup.Append>
              </InputGroup>
            </form>
          </div>}
          {addStudentValidation !== "" && <div className="action text-red-500">{addStudentValidation}</div>}
          {edit && (
          <div className="action d-flex justify-content-between">
            <Button
              className="btn btn-success"
              onClick={updateCol}
              disabled={!edit}
              value={1}
            >
              +
                </Button>
            <div className="mx-4">columns</div>
            <Button
              className="btn btn-success"
              onClick={updateCol}
              disabled={!edit}
              value={-1}
            >
              -
                </Button>
          </div>
          <div className="action d-flex justify-content-between">
            <Button
              className="btn btn-success"
              onClick={updateRow}
              disabled={!edit}
              value={1}
            >
              +
                </Button>
            <div className="mx-4">rows</div>
            <Button
              className="btn btn-success"
              onClick={updateRow}
              disabled={!edit}
              value={-1}
            >
              -
                </Button>
          </div>
          <div className="action">
            <div>
              <Button
                className="full-button btn btn-success"
                // onClick={enterFullScreen}
                disabled={!!edit}
              >
                Full Screen
                </Button>
            </div>
          </div>
          )}
          )}

        </div>
    )
}