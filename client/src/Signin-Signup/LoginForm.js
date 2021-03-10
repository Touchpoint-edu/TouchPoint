import React, {useState, useContext} from 'react';
import * as Yup from "yup";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import FloatingTextField from "../Components/FloatingTF";
import Button from "../Components/Button";
import { login } from "../api/auth.js";
import { DataStoreContext } from "../contexts";
import GoogleSignIn from './GoogleSignIn';


export default function LoginForm({onClose}) {

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email required"),
        password: Yup.string().required("Password required"),
      });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, setUser } = useContext(DataStoreContext);
    const history = useHistory();
  
    async function handleSubmit(e) {
      e.preventDefault();
      
      try {
        const user = await login({ email, password });
        setUser(user);
        onClose();
        history.push("/dashboard");
      } catch (error) {
        console.error(error);
      }
    }

    return (
        <>
          <div className="mt-8 d-flex justify-content-start ml-5 modal-header-text">
            <h2 >Sign in</h2>
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
              handleSubmit,
              isSubmitting,
            }) => (
              <form >
                <FloatingTextField
                  className="mt-8"
                  id="sign-in-email"
                  name="email"
                  placeholder="Email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  error={errors.email}
                  className = "ml-5"   
                />
                {errors.email && (
                  <p className="text-red-500 ml-5">{errors.email}</p>
                )}
                <FloatingTextField
                  className={errors.email ? "mt-2" : "mt-8"}
                  id="sign-in-password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlur}
                  error={errors.password}
                  className = "ml-5" 
                />
                {errors.password && (
                  <p className="text-red-500 ml-5">{errors.password}</p>
                )}
                <Button
                  className={`${
                    errors.password  ? "mt-3" : "mt-4"
                  } h-12 text-xl, submit_button ml-5`}
                  variant="filled"
                  fullWidth={true}
                  type="submit"
                  onClick = {handleSubmit}

                >
                  Sign in
                </Button>
                <hr className="solid my-4" />
                <GoogleSignIn
                    className = "google-button ml-5 mb-6"
                    onClose = {onClose}
                >
                </GoogleSignIn>
       
                    
              </form>
            )}
          </Formik>
          
          
          
        </>
      );
}