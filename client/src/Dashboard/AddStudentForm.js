import React, { useState } from "react";
import { Container, Modal, Button,Spinner, ModalTitle } from 'react-bootstrap'
import { Formik, Form } from "formik";
import * as Yup from "yup";

import FloatingTextField from "../Components/FloatingTF";
import { addStudent } from "../api/class_period";

export default function AddStudentForm(props) {

    const [show, setShow] = useState(false);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Student name required"),
        email: Yup.string().email("Invalid email").required("Email required"),
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = async (values) => {
        // TODO: edit first parameter (period_id)
        const response = await addStudent(4, values.name, values.email);
        const responseData = await response.json();

        if (response.status === 200) {
            const newStudent = {
                id: 40,
                name: values.name,
                data:
                {
                    category: 1,
                    behavior: 0,
                },
            }
            props.setStudents([...props.students, newStudent]);
            handleClose();
        } else if (response.status === 500) {
            alert(responseData.message)
        } else {
            alert("Please try again later.")
        }
    }

    const showForm = (formProps) => (
        <Form onSubmit={formProps.handleSubmit}>
            <Modal.Header closeButton className="px-0">
                <ModalTitle>
                    Add Student
                </ModalTitle>
            </Modal.Header>

            <FloatingTextField
                name="name"
                placeholder="Student Name"
                type="text"
                value={formProps.values.name}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
                error={!!formProps.errors.name}
            />
            {
                formProps.errors.name && formProps.touched.name &&
                <p className="text-red-500 mb-0">{formProps.errors.name}</p>
            }

            <FloatingTextField
                name="email"
                placeholder="Student Email"
                type="text"
                value={formProps.values.email}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
                error={!!formProps.errors.email}
            />
            {
                formProps.errors.email && formProps.touched.email &&
                <p className="text-red-500">{formProps.errors.email}</p>
            }

            <Modal.Footer className="px-0 justify-content-between">
                <Button
                    variant="outline-secondary"
                    onClick={handleClose}
                    className="m-0"
                    style={{ width: "47%" }}
                >
                    Cancel
                </Button>
                <Button
                    variant="success"
                    type="submit"
                    className="m-0"
                    style={{ width: "47%" }}
                    disabled={formProps.isSubmitting}
                >
                    {formProps.isSubmitting ? <Spinner animation="border" variant="light" size="sm"/> : "Add Student"}
                </Button>
            </Modal.Footer>
        </Form>
    )

    return (
        <>
            <Button variant="success" onClick={handleShow}>+ Add Student</Button>

            <Modal size="sm" centered show={show} onHide={handleClose} >
                <Container fluid className="px-4">
                    <Formik
                        initialValues={{ name: "", email: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {props => showForm(props)}
                    </Formik>
                </Container>
            </Modal>
        </>
    );
}