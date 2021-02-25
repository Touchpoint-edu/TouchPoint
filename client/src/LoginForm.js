import React, {useState, useContext} from 'react';
import * as Yup from "yup";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import FloatingTextField from "./FloatingTF";
import Button from "./Button";
import { login } from "./auth";
import { DataStoreContext } from "./contexts";
import GoogleSignIn from './GoogleSignIn';


export default function LoginForm() {

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email required"),
        password: Yup.string().required("Password required"),
      });

    const [email, setEmail] = useState("dtang@usc.edu");
    const [password, setPassword] = useState("password");
    const { user, setUser } = useContext(DataStoreContext);
    const history = useHistory();
  
    async function handleSubmit(e) {
      e.preventDefault();
  
      try {
        const user = await login({ email, password });
        setUser(user);
        history.push("/");
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
              <form onSubmit={handleSubmit}>
                <FloatingTextField
                  className="mt-8"
                  id="sign-in-email"
                  name="email"
                  placeholder="Email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  error={!!errors.email && touched.email}
                  className = "ml-5"   
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 ml-5">{errors.email}</p>
                )}
                <FloatingTextField
                  className={errors.email && touched.email ? "mt-2" : "mt-8"}
                  id="sign-in-password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlur}
                  error={!!errors.password && touched.password}
                  className = "ml-5" 
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 ml-5">{errors.password}</p>
                )}
                <Button
                  className={`${
                    errors.password && touched.password ? "mt-3" : "mt-4"
                  } h-12 text-xl, submit_button ml-5`}
                  variant="filled"
                  fullWidth={true}
                  type="submit"

                >
                  Sign in
                </Button>
                <hr className="solid my-4" />
                <Button
                        className = "google_button ml-5 mb-3"
                        fullWidth={true}
                        type="google"
                        >
                        Sign in with Google
                </Button>
                <GoogleSignIn/>
              </form>
            )}
          </Formik>
          
          
          
        </>
      );
}