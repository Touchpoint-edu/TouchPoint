import React, {useState, useContext} from 'react';
import * as Yup from "yup";
import { Formik } from "formik";
import FloatingTextField from "../Components/FloatingTF.js";
import { DataStoreContext } from "../contexts.js";
import GoogleSignIn from './GoogleSignIn';
import Button from "../Components/Button";
import { signUp } from "../api/auth";
import { useHistory } from "react-router-dom";


export default function SignupForm({ toggleVariant, onClose }) {
   

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Email required").email("Invalid email"),
        password: Yup.string()
          .required("Password required")
          .min(8, "Must contain at least 8 characters"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Password does not match")
          .required("Confirm Password Required"),
      });
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { user, setUser } = useContext(DataStoreContext);
    const history = useHistory();
  
    async function handleSubmit(e) {
      e.preventDefault();
      const user = await signUp({ email, password, confirmPassword });
      setUser(user);
      history.push("/dashboard");
      onClose();
    }
  
    return (
        <>
          <div className="mt-8 d-flex justify-content-start ml-5 modal-header-text">
            <h2>Create your account</h2>
          </div>
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              errors,
              touched,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form >
                <FloatingTextField
                  className="mt-8"
                  id="sign-up-email"
                  name="email"
                  placeholder="Email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  error={errors.email}
                  className = "ml-5 ftf" 
                />
                {errors.email && (
                  <p className="text-red-500 ml-5">{errors.email}</p>
                )}
                <FloatingTextField
                  className={errors.email ? "mt-2" : "mt-8"}
                  id="sign-up-password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlur}
                  error={!!errors.password}
                  className = "ml-5" 
                />
                {errors.password && (
                  <p className="text-red-500 ml-5">{errors.password}</p>
                )}
                <FloatingTextField
                  className={errors.password ? "mt-2" : "mt-8"}
                  id="sign-up-password-confirm"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  className = "ml-5" 
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 ml-5">{errors.confirmPassword}</p>
                )}
                <p className="ml-5 mr-5 terms"> By signing up, you agree to the <a href="#" id="terms-highlight">Terms of Service</a> and <a href="#" id="terms-highlight">Privacy Policy</a>, including Cookie Use. </p>
                <Button
                  className={`${
                    errors.password? "mt-2" : "mt-8"
                  } h-12 text-xl submit_button ml-5 mt-3 mb-5`}
                  fullWidth={true}
                  disabled={isSubmitting}
                  onSubmit = {handleSubmit}
                  onClose = {onClose}
                >
                  Create Account
                </Button>
                <GoogleSignIn/>
              </form>
            )}
          </Formik>
     
          
          
        </>
      );
}
