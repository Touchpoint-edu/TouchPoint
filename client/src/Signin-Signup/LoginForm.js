import React, { useState, useContext } from 'react';
import * as Yup from "yup";
import { Formik, Form } from "formik";
import FloatingTextField from "../Components/FloatingTF";
import Button from "../Components/Button";
import { login } from "../api/auth";
import GoogleSignIn from './GoogleSignIn';
import { Redirect, useHistory } from "react-router-dom";
import { DataStoreContext } from "../contexts.js";
import { loginWithGoogle } from "../api/auth";


export default function LoginForm({onClose}) {

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email required"),
        password: Yup.string().required("Password required"),
      });

    const [isAuthenticated, setAuthenticated] = useState("");
    const { user, setUser } = useContext(DataStoreContext);
    const [loginErrorMsg, setLoginErrorMsg] = useState("");
    const history = useHistory();
    async function handleSubmit(values) {

      try {
        const res = await login({ 
          email: values.email, 
          password: values.password 
        });
        if (res.status === 200) {
          let json = await res.json();
          console.log(json);
          setUser(json.name);
          history.push("/dashboard");
          setAuthenticated(true);
          onClose();
        }
        else {
          const json = res.json();
          if (!!json.message) {
            console.log(json.message);
            setLoginErrorMsg(json.message);
          }
          else {
            setLoginErrorMsg("There was an error. Please try again later.");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    return (
        <>
          <div className="d-flex justify-content-start modal-header-text">
            <h2>Sign in</h2>
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              errors,
              touched,
              handleBlur,
              handleChange,
              isSubmitting,
              values
            }) => (
              <Form >
                <FloatingTextField
                  className="mt-8"
                  name="email"
                  placeholder="Email"
                  type="text"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.email}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 mb-0">{errors.email}</p>
                )}
                <FloatingTextField
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.password}
                />
                {errors.password && touched.password && 
                  <p className="text-red-500 mb-0">{errors.password}</p>
                }
                <Button
                  className="mt-3 h-12 text-xl w-100 submit_button"
                  variant="filled"
                  fullWidth={true}
                  type="submit"
                >
                  Sign in
                </Button>
                <p className="text-red-500 mt-3">{loginErrorMsg}</p>
                <hr className="solid my-4" />
                    <GoogleSignIn
                      onClose = {onClose}
                      dbFunc={loginWithGoogle}
                    >
                    </GoogleSignIn>
             </Form>
            )}
          </Formik>
          
          { isAuthenticated === true ? <Redirect to="/dashboard"/> : null}
          
        </>
      );
}