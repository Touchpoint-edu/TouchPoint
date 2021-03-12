import React, {useState, useContext} from 'react';
import * as Yup from "yup";
import { Formik } from "formik";
import FloatingTextField from "./FloatingTF";
import { DataStoreContext } from "./contexts";
import GoogleSignIn from './GoogleSignIn';
import Button from "./Button";
import { signUp, signUpWithGoogle } from "./auth";
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
          <div className="mt-8 d-flex justify-content-start modal-header-text">
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
                  className = "ftf" 
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email}</p>
                )}
                <FloatingTextField
                  id="sign-up-password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlur}
                  error={!!errors.password}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password}</p>
                )}
                <FloatingTextField
                  id="sign-up-password-confirm"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">{errors.confirmPassword}</p>
                )}
                <p className="terms mt-3"> By signing up, you agree to the <a href="#" id="terms-highlight">Terms of Service</a> and <a href="#" id="terms-highlight">Privacy Policy</a>, including Cookie Use. </p>
                <Button
                  className={` w-100 h-12 text-xl submit_button mt-3`}
                  fullWidth={true}
                  disabled={isSubmitting}
                  onSubmit = {handleSubmit}
                >
                  Create Account
                </Button>
                <hr />
                <GoogleSignIn buttonText="Sign up with Google" dbFunc={signUpWithGoogle}/>
              </form>
            )}
          </Formik>
     
          
          
        </>
      );
}
