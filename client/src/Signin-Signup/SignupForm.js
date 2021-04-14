import React, {useState, useContext} from 'react';
import * as Yup from "yup";
import { Formik, Form } from "formik";
import FloatingTextField from "../Components/FloatingTF.js";
import { DataStoreContext } from "../contexts.js";
import GoogleSignIn from './GoogleSignIn';
import Button from "../Components/Button";
import { signUp, signUpWithGoogle } from "../api/auth";
import { useHistory } from "react-router-dom";


export default function SignupForm({ toggleVariant, onClose }) {
   

    const validationSchema = Yup.object().shape({
        fname: Yup.string().required("First name is required"),
        lname: Yup.string().required("Last name is required"),
        email: Yup.string().required("Email required").email("Invalid email"),
        password: Yup.string()
          .required("Password required")
          .min(8, "Must contain at least 8 characters"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Password does not match")
          .required("Confirm Password Required"),
      });
  
    const [ signUpErrorMsg, setSignUpErrorMsg ] = useState("");
  
    async function handleSubmit(data) {
      const res = await signUp({ 
          email: data.email, 
          password: data.password, 
          confirm: data.confirmPassword,
          fname: data.fname,
          lname:data.lname
        });
      if (res.status === 201) {
        setSignUpErrorMsg("Your account has been successfully created. Please check your email to verify your account.");
      }
      else if (res.status === 500) {
        setSignUpErrorMsg("There was an error. Please try again later.");
      }
      else {
        const json = await res.json();
        if (!!json && !!json.message) {
          setSignUpErrorMsg(json.message);
        }
      }
    }
  
    return (
        <>
          <Formik
            initialValues={{ fname: "", lname: "", email: "", password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              values
            }) => (
              <Form>
                <FloatingTextField
                  className="mt-8 ftf"
                  name="fname"
                  placeholder="First Name"
                  type="text"
                  value={values.fname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.fname}
                />
                {errors.fname && touched.fname && (
                  <p className="text-red-500 mb-0">{errors.fname}</p>
                )}
                <FloatingTextField
                  className="mt-8 ftf"
                  name="lname"
                  placeholder="Last Name"
                  type="text"
                  value={values.lname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.lname}
                />
                {errors.lname && touched.lname && (
                  <p className="text-red-500 mb-0">{errors.lname}</p>
                )}
                <FloatingTextField
                  className="mt-8 ftf"
                  id="sign-up-email"
                  name="email"
                  placeholder="Email"
                  type="text"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 mb-0">{errors.email}</p>
                )}
                <FloatingTextField
                  id="sign-up-password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.password}
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 mb-0">{errors.password}</p>
                )}
                <FloatingTextField
                  id="sign-up-password-confirm"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 mb-0">{errors.confirmPassword}</p>
                )}
                <p className="terms mt-3"> By signing up, you agree to the <a href="#" id="terms-highlight">Terms of Service</a> and <a href="#" id="terms-highlight">Privacy Policy</a>, including Cookie Use. </p>
                <Button
                  className={` w-100 h-12 text-xl sign_button mt-3`}
                  fullWidth={true}
                  disabled={isSubmitting}
                  onSubmit = {handleSubmit}
                  onClose = {onClose}
                >
                  Create Account
                </Button>
                <p className="text-red-500 mt-3">{signUpErrorMsg}</p>
                <hr />
                <GoogleSignIn buttonText="Sign up with Google" dbFunc={signUpWithGoogle}/>
              </Form>
            )}
          </Formik>
     
          
          
        </>
      );
}
